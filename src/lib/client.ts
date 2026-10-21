import type {Service, User, Friend, FriendRequest, Registration,HandleAvailability,PlayerLookup,DailyRace,StepUpload} from './types';
import type {Appearance} from './character/catalog';

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) {super(message);}
}
export interface TokenStore {get(): Promise<string | null>; set(value: string): Promise<void>; clear(): Promise<void>;}
type Tokens = {accessToken: string; refreshToken: string};

export class ApiClient implements Service {
  private access: string | null = null;
  private refreshing: Promise<void> | null = null;
  private epoch = 0;
  constructor(private base: string, private store: TokenStore, private transport: typeof fetch = fetch,
    private onExpired: () => void = () => {}) {
    const url = new URL(base);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
      throw new Error('API URL must be a plain HTTP(S) URL');
    }
    this.base = base.replace(/\/$/, '');
  }
  private async raw(path: string, method = 'GET', body?: unknown, access?: string | null) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      // Browser fetch requires its normal global receiver, not this ApiClient instance.
      const transport=this.transport;
      const response = await transport(this.base + path, {
        method, signal: controller.signal,
        headers: {Accept: 'application/json', ...(body !== undefined ? {'Content-Type':'application/json'} : {}),
          ...(access ? {Authorization: `Bearer ${access}`} : {})},
        ...(body !== undefined ? {body: JSON.stringify(body)} : {}),
      });
      const text = await response.text();
      let data: any;
      try {data = text ? JSON.parse(text) : undefined;} catch {throw new ApiError(response.status, 'INVALID_RESPONSE', 'The server returned an unreadable response.');}
      if (!response.ok) throw new ApiError(response.status, data?.error?.code ?? 'REQUEST_FAILED', data?.error?.message ?? 'The request could not be completed.');
      return data;
    } catch (e) {
      if (e instanceof ApiError) throw e;
      throw new ApiError(0, 'NETWORK_ERROR', 'Cannot reach the server. Check your connection and try again.');
    } finally {clearTimeout(timer);}
  }
  private async save(tokens: Tokens, epoch: number) {
    if (this.epoch !== epoch) throw new ApiError(401, 'SESSION_CHANGED', 'Please sign in again.');
    await this.store.set(tokens.refreshToken);
    if (this.epoch !== epoch) {await this.store.clear(); throw new ApiError(401, 'SESSION_CHANGED', 'Please sign in again.');}
    this.access = tokens.accessToken;
  }
  private async expire() {
    this.epoch++;
    this.access = null;
    await this.store.clear();
    this.onExpired();
  }
  private async refresh() {
    if (this.refreshing) return this.refreshing;
    const epoch = this.epoch;
    this.refreshing = (async () => {
      const token = await this.store.get();
      if (!token) throw new ApiError(401, 'UNAUTHORIZED', 'Please sign in again.');
      const next = await this.raw('/auth/refresh', 'POST', {refreshToken: token});
      await this.save(next, epoch);
    })().catch(async e => {
      if (e instanceof ApiError && [400,401].includes(e.status) && epoch === this.epoch) await this.expire();
      throw e;
    }).finally(() => {this.refreshing = null;});
    return this.refreshing;
  }
  private async call(path: string, method = 'GET', body?: unknown) {
    const epoch = this.epoch, original = this.access;
    try {return await this.raw(path, method, body, original);}
    catch (e) {
      if (!(e instanceof ApiError) || e.status !== 401 || epoch !== this.epoch) throw e;
      // Another request may already have rotated the token while this one was in flight.
      if (this.access === original) await this.refresh();
      if (epoch !== this.epoch) throw new ApiError(401,'SESSION_CHANGED','Please sign in again.');
      try {return await this.raw(path,method,body,this.access);}
      catch (retry) {if (retry instanceof ApiError && retry.status === 401) await this.expire(); throw retry;}
    }
  }
  async restore() {
    if (!(await this.store.get())) return null;
    await this.refresh();
    return (await this.call('/me')).user as User;
  }
  async login(email: string, password: string) {
    const epoch = ++this.epoch;
    const tokens = await this.raw('/auth/login', 'POST', {email:email.trim(), password});
    await this.save(tokens,epoch);
    return (await this.call('/me')).user as User;
  }
  async register(input: Registration) {
    const epoch = ++this.epoch;
    const result = await this.raw('/auth/register','POST',input);
    await this.save(result,epoch);
    return {...result.user,username:result.user.username??'',email:input.email.trim()} as User;
  }
  async logout() {
    try {await this.call('/auth/logout','POST');}
    finally {await this.expire();}
  }
  async all<T>(path: string): Promise<T[]> {
    const result: T[] = [];
    for (let offset = 0; ; offset += 100) {
      const page = await this.call(`${path}?limit=100&offset=${offset}`);
      result.push(...page.data);
      if (page.data.length < 100) return result;
      if (offset >= 100000) throw new Error('Too many records to display.');
    }
  }
  friends() {return this.all<Friend>('/friends');}
  requests() {return this.all<FriendRequest>('/friend-requests');}
  usernameAvailability(username:string):Promise<HandleAvailability> {return this.call('/usernames/availability?username='+encodeURIComponent(username));}
  async completeOnboarding(username:string,appearance:Appearance) {
    try {return (await this.call('/me/onboarding','PUT',{username,appearance})).user as User;}
    catch(e) {
      // A lost success response must not trap an already-completed account in setup.
      if(e instanceof ApiError&&e.code==='ONBOARDING_COMPLETE')return (await this.call('/me')).user as User;
      throw e;
    }
  }
  async saveAppearance(appearance:Appearance) {return (await this.call('/me/appearance','PUT',{appearance})).user as User;}
  lookupPlayer(username:string):Promise<PlayerLookup> {return this.call('/users/'+encodeURIComponent(username));}
  async dailyRace():Promise<DailyRace> {
    let race:DailyRace|undefined;
    for(let offset=0;;offset+=100) {
      const page=await this.call('/race/today?limit=100&offset='+offset) as DailyRace;
      if(!race) race={...page,data:[]};
      if(page.day!==race.day) throw new Error('The race just reset. Refresh to see today’s race.');
      race.data.push(...page.data);
      if(page.data.length<100) return race;
      if(offset>=100000) throw new Error('Too many players to display.');
    }
  }
  async syncSteps(input:StepUpload) {await this.call('/steps/today','PUT',input);}
  async sendRequest(username: string) {await this.call('/friend-requests','POST',{username:username.trim()});}
  async respond(id: string,action: 'accept'|'decline') {await this.call(`/friend-requests/${encodeURIComponent(id)}`,'PATCH',{action});}
  async cancel(id: string) {await this.call(`/friend-requests/${encodeURIComponent(id)}`,'DELETE');}
  async remove(id: string) {await this.call(`/friends/${encodeURIComponent(id)}`,'DELETE');}
  async updateName(displayName: string) {return (await this.call('/me','PATCH',{displayName:displayName.trim()})).user as User;}
  async health() {try {const r=await this.raw('/health'); return r.status==='ok' && r.database==='up';} catch {return false;}}
}
