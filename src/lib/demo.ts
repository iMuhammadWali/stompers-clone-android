import {raceWindow} from './race-time';
import type {Appearance} from './character/catalog';
import type {PlayerLookup,DailyRace,StepUpload,Service,User,Friend,FriendRequest,Registration} from './types';

export class DemoService implements Service {
  private me: User = {id:'demo-me',username:'you',displayName:'Alex Walker',email:'alex@example.com',onboardingComplete:true};
  private people: Friend[] = [
    {id:'friend-1',username:'maya_moves',displayName:'Maya Chen'},
    {id:'friend-2',username:'omar_outside',displayName:'Omar Hassan'},
    {id:'friend-3',username:'ellie_walks',displayName:'Ellie Brooks'},
  ];
  private pending: FriendRequest[] = [
    {id:'request-1',senderId:'friend-4',recipientId:'demo-me',senderUsername:'leo_walks',recipientUsername:'you',status:'pending'},
    {id:'request-2',senderId:'friend-5',recipientId:'demo-me',senderUsername:'nina_steps',recipientUsername:'you',status:'pending'},
    {id:'request-3',senderId:'demo-me',recipientId:'friend-6',senderUsername:'you',recipientUsername:'sam_roams',status:'pending'},
  ];
  async restore() {return {...this.me};}
  async login(_email: string,_password: string) {return {...this.me};}
  async register(_input: Registration) {return {...this.me};}
  async logout() {}
  async friends() {return this.people.map(p=>({...p}));}
  async requests() {return this.pending.map(p=>({...p}));}
  async sendRequest(value: string) {
    const name=value.trim().toLowerCase();
    if (name===this.me.username) throw new Error('You cannot send yourself a request.');
    if (this.people.some(p=>p.username===name)) throw new Error('You are already friends.');
    if (this.pending.some(p=>p.senderUsername===name||p.recipientUsername===name)) throw new Error('A request is already pending.');
    this.pending.push({id:`demo-${Date.now()}`,senderId:this.me.id,recipientId:`user-${name}`,senderUsername:this.me.username,recipientUsername:name,status:'pending'});
  }
  async respond(id: string,action: 'accept'|'decline') {
    const r=this.pending.find(p=>p.id===id && p.recipientId===this.me.id);
    if (!r) throw new Error('Request not found.');
    if(action==='accept') this.people.push({id:r.senderId,username:r.senderUsername,displayName:r.senderUsername.split('_')[0].replace(/^./,s=>s.toUpperCase())});
    this.pending=this.pending.filter(p=>p.id!==id);
  }
  async cancel(id: string) {this.pending=this.pending.filter(p=>p.id!==id || p.senderId!==this.me.id);}
  async remove(id: string) {this.people=this.people.filter(p=>p.id!==id);}
  async updateName(name: string) {this.me={...this.me,displayName:name};return {...this.me};}
  async usernameAvailability(username:string) {return {username,available:!this.people.some(p=>p.username===username),suggestions:[]};}
  async completeOnboarding(username:string,appearance:Appearance) {this.me={...this.me,username,appearance,onboardingComplete:true};return {...this.me};}
  async saveAppearance(appearance:Appearance) {this.me={...this.me,appearance};return {...this.me};}
  async lookupPlayer(username:string):Promise<PlayerLookup> {
    const user=[this.me,...this.people].find(p=>p.username===username)??(username==='trail_friend'?{id:'trail-friend',username,displayName:'Trail Friend'}:null);
    if(!user)throw new Error('No sample player has that username. Try trail_friend.');
    return {user,relationship:user.id===this.me.id?'self':this.people.some(p=>p.id===user.id)?'friends':this.pending.some(p=>p.recipientUsername===username)?'outgoing':'none'};
  }
  async dailyRace():Promise<DailyRace> {return {...raceWindow(),data:[this.me,...this.people].map(p=>({...p,steps:null,source:null,lastSyncedAt:null}))};}
  async syncSteps(_input:StepUpload) {}
  async health() {return true;}
}
