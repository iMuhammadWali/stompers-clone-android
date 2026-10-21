import {test} from 'node:test';
import assert from 'node:assert/strict';
import {ApiClient} from '../src/lib/client';
import {defaultAppearance} from '../src/lib/character/catalog';
import {raceWindow} from '../src/lib/race-time';
import {stepUpload} from '../src/lib/step-upload';

const store={get:async()=>null,set:async(_s:string)=>{},clear:async()=>{}};
const json=(body:unknown,status=200)=>new Response(body?JSON.stringify(body):null,{status});

test('setup sends character and username, recovers when a success response was lost',async()=>{
  const calls:any[]=[];
  const api=new ApiClient('https://example.com/api/v1',store,async(url,init)=>{
    calls.push({url,init});
    return String(url).endsWith('/me/onboarding')?json({error:{code:'ONBOARDING_COMPLETE',message:'Already set up'}},409):json({user:{id:'one',username:'wali',onboardingComplete:true,appearance:defaultAppearance}});
  });
  const user=await api.completeOnboarding('wali',defaultAppearance);
  assert.equal(user.onboardingComplete,true);
  assert.deepEqual(JSON.parse(calls[0].init.body),{username:'wali',appearance:defaultAppearance});
  assert.equal(calls[1].url,'https://example.com/api/v1/me');
});

test('availability and lookup encode handles; failed claims remain actionable',async()=>{
  const calls:string[]=[];
  const api=new ApiClient('https://example.com/api/v1',store,async url=>{calls.push(String(url));return json({error:{code:'USERNAME_TAKEN',message:'Choose another username.'}},409);});
  await assert.rejects(()=>api.completeOnboarding('wali',defaultAppearance),/Choose another username/);
  await assert.rejects(()=>api.usernameAvailability('a&b'));
  await assert.rejects(()=>api.lookupPlayer('a/b'));
  assert.match(calls[1],/username=a%26b$/);assert.match(calls[2],/users\/a%2Fb$/);
});

test('daily race loads every page and refuses to mix two race days',async()=>{
  let count=0;
  const api=new ApiClient('https://example.com/api/v1',store,async()=>{
    count++;return json({...raceWindow(),data:count===1?Array.from({length:100},(_,i)=>({id:String(i)})):[{id:'last'}]});
  });
  assert.equal((await api.dailyRace()).data.length,101);
  let calls=0;
  const midnight=new ApiClient('https://example.com/api/v1',store,async()=>json({day:++calls===1?'2026-10-21':'2026-10-22',data:calls===1?Array(100).fill({}):[]}));
  await assert.rejects(()=>midnight.dailyRace(),/race just reset/);
});

test('step sync sends one absolute total with the chosen source; unknown and stale totals never upload',()=>{
  const now=new Date('2026-10-21T18:30:00Z'),day=raceWindow(now).day;
  const state={day,status:'ready' as const,steps:420,updatedAt:now.toISOString()};
  assert.deepEqual(stepUpload(state,null,now),{day,steps:420,source:'health-connect',observedAt:now.toISOString()});
  assert.equal(stepUpload({...state,status:'error'},null,now),null);
  assert.equal(stepUpload({...state,steps:null},null,now),null);
  assert.equal(stepUpload({...state,day:'2026-10-20'},null,now),null);
  assert.equal(stepUpload({...state,updatedAt:'2026-10-21T18:00:00Z'},null,now),null);
});

test('daily race uses Pakistan midnight even when device timezone differs',()=>{
  const previous=process.env.TZ;process.env.TZ='America/New_York';
  try {
    assert.equal(raceWindow(new Date('2026-10-21T18:59:59Z')).day,'2026-10-21');
    const next=raceWindow(new Date('2026-10-21T19:00:00Z'));
    assert.equal(next.day,'2026-10-22');assert.equal(next.startTime,'2026-10-21T19:00:00.000Z');
  } finally {if(previous===undefined)delete process.env.TZ;else process.env.TZ=previous;}
});
