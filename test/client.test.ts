import {test} from 'node:test';
import assert from 'node:assert/strict';
import {ApiClient,ApiError,type TokenStore} from '../src/lib/client';
import {DemoService} from '../src/lib/demo';

function memory(value:string|null=null):TokenStore {let token=value;return {get:async()=>token,set:async v=>{token=v;},clear:async()=>{token=null;}};}
const json=(body:unknown,status=200)=>new Response(body===undefined?null:JSON.stringify(body),{status,headers:{'Content-Type':'application/json'}});
const me={id:'a',username:'alice',displayName:'Alice'};

test('transport is called without binding the API client as its receiver',async()=>{
  const api=new ApiClient('https://api.example/api/v1',memory(),async function(this:unknown) {
    assert.equal(this,undefined);return json({status:'ok',database:'up'});
  });
  assert.equal(await api.health(),true);
});

test('login stores only refresh token and attaches bearer access token',async()=>{
  const store=memory();const calls:any[]=[];
  const fetcher:typeof fetch=async(url,init)=>{calls.push({url,init});if(String(url).endsWith('/auth/login'))return json({accessToken:'access',refreshToken:'refresh'});return json({user:me});};
  const api=new ApiClient('https://api.example/api/v1',store,fetcher);
  assert.equal((await api.login('alice@example.com','password')).username,'alice');
  assert.equal(await store.get(),'refresh');assert.equal(calls[1].init.headers.Authorization,'Bearer access');
});
test('concurrent 401 responses share one refresh operation',async()=>{
  const store=memory('old-refresh');let refreshes=0;
  const fetcher:typeof fetch=async(url,init)=>{
    if(String(url).endsWith('/auth/refresh')){refreshes++;await new Promise(r=>setTimeout(r,10));return json({accessToken:'new-access',refreshToken:'new-refresh'});}
    if((init?.headers as any)?.Authorization==='Bearer new-access')return json({data:[]});
    return json({error:{message:'Expired'}},401);
  };
  const api=new ApiClient('https://api.example/api/v1',store,fetcher);
  await Promise.all([api.friends(),api.requests()]);
  assert.equal(refreshes,1);assert.equal(await store.get(),'new-refresh');
});
test('network failure during refresh preserves saved token for retry',async()=>{
  const store=memory('valid-refresh');
  const api=new ApiClient('https://api.example/api/v1',store,async()=>{throw new TypeError('offline');});
  await assert.rejects(()=>api.restore(),(e:unknown)=>e instanceof ApiError && e.code==='NETWORK_ERROR');
  assert.equal(await store.get(),'valid-refresh');
});
test('invalid refresh clears saved session and notifies UI',async()=>{
  const store=memory('invalid-refresh');let expired=false;
  const api=new ApiClient('https://api.example/api/v1',store,async()=>json({error:{message:'Invalid token'}},401),()=>{expired=true;});
  await assert.rejects(()=>api.restore());assert.equal(await store.get(),null);assert.equal(expired,true);
});
test('logout clears local token even if server is offline',async()=>{
  const store=memory('refresh');let expired=false;
  const api=new ApiClient('https://api.example/api/v1',store,async()=>{throw new Error('offline');},()=>{expired=true;});
  await assert.rejects(()=>api.logout());assert.equal(await store.get(),null);assert.equal(expired,true);
});
test('pagination fetches every API page',async()=>{
  let calls=0;
  const api=new ApiClient('https://api.example/api/v1',memory(),async(url)=>{calls++;return json({data:String(url).includes('offset=0')?Array.from({length:100},(_,i)=>({id:String(i)})):[{id:'last'}]});});
  assert.equal((await api.friends()).length,101);assert.equal(calls,2);
});
test('204 responses are handled without parsing JSON',async()=>{
  const api=new ApiClient('https://api.example/api/v1',memory(),async()=>json(undefined,204));
  await api.remove('friend-id');
});
test('structured backend errors retain their message and code',async()=>{
  const api=new ApiClient('https://api.example/api/v1',memory(),async()=>json({error:{code:'ALREADY_FRIENDS',message:'Users are already friends'}},409));
  await assert.rejects(()=>api.sendRequest('alice'),(e:unknown)=>e instanceof ApiError && e.code==='ALREADY_FRIENDS' && e.message==='Users are already friends');
});
test('health distinguishes an unavailable database',async()=>{
  const api=new ApiClient('https://api.example/api/v1',memory(),async()=>json({status:'unavailable',database:'down'},503));assert.equal(await api.health(),false);
});
test('demo accepts requests, adds friends, cancels requests and removes friends',async()=>{
  const demo=new DemoService();await demo.respond('request-1','accept');assert.equal((await demo.friends()).length,4);
  await demo.sendRequest('trail_friend');assert.equal((await demo.requests()).length,3);
  const r=(await demo.requests()).find(r=>r.recipientUsername==='trail_friend')!;await demo.cancel(r.id);
  await demo.remove('friend-1');assert.equal((await demo.friends()).length,3);
  await assert.rejects(()=>demo.sendRequest('you'));await assert.rejects(()=>demo.sendRequest('ellie_walks'));
});

test('friends reads coalesce, reuse cache, and invalidate after mutations',async()=>{
  let reads=0;let release:()=>void=()=>{};const gate=new Promise<void>(r=>{release=r;});
  const api=new ApiClient('https://api.example/api/v1',memory(),async(url,init)=>{
    if(String(url).includes('/friends?')){reads++;await gate;return json({data:[me]});}
    return json(undefined,204);
  });
  const a=api.friends(),b=api.friends();release();await Promise.all([a,b]);assert.equal(reads,1);
  await api.friends();assert.equal(reads,1);
  await api.remove('b');await api.friends();assert.equal(reads,2);
  api.invalidateCache();await api.friends();assert.equal(reads,3);
});
test('a failed read is retried and a late read cannot refill an invalidated cache',async()=>{
  let calls=0;let resolve:(value:Response)=>void=()=>{};const pending=new Promise<Response>(r=>{resolve=r;});
  const api=new ApiClient('https://api.example/api/v1',memory(),async()=>{calls++;if(calls===1)return pending;if(calls===2)throw new Error('offline');return json({data:[]});});
  const old=api.friends();api.invalidateCache();resolve(json({data:[me]}));await old;
  await assert.rejects(api.friends());await api.friends();assert.equal(calls,3);
});
