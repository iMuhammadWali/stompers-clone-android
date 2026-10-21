import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readTodaySteps,todayWindow,type HealthBridge,type StepRequest} from '../src/lib/health/service';
function fake(options:{sdk?:number;permissions?:boolean;grant?:boolean;count?:number|null;fail?:boolean}={}) {
  const calls:{request?:unknown;aggregate?:StepRequest}={};
  const bridge:HealthBridge={
    getSdkStatus:async()=>options.sdk??3,initialize:async()=>true,
    getGrantedPermissions:async()=>options.permissions===false?[]:[{accessType:'read',recordType:'Steps'}],
    requestPermission:async p=>{calls.request=p;return options.grant?[{accessType:'read',recordType:'Steps'}]:[];},
    aggregateRecord:async p=>{calls.aggregate=p;if(options.fail)throw new Error('read failure');return {COUNT_TOTAL:options.count===undefined?6142:options.count};},
    openHealthConnectSettings:()=>{},
  };return {bridge,calls};
}
const now=new Date('2026-10-16T13:00:00Z');
test('reads the Health Connect aggregate for today without summing raw source records',async()=>{
  const {bridge,calls}=fake();const value=await readTodaySteps(bridge,false,now);
  assert.equal(value.status,'ready');assert.equal(value.steps,6142);assert.equal(value.updatedAt,now.toISOString());
  assert.deepEqual(calls.aggregate,{recordType:'Steps',timeRangeFilter:{operator:'between',startTime:todayWindow(now).startTime,endTime:now.toISOString()}});
  assert.equal(calls.request,undefined);
});
test('requests only read Steps after an explicit connect action',async()=>{
  const {bridge,calls}=fake({permissions:false,grant:true});
  assert.equal((await readTodaySteps(bridge,false,now)).status,'permission-required');assert.equal(calls.request,undefined);
  assert.equal((await readTodaySteps(bridge,true,now)).steps,6142);
  assert.deepEqual(calls.request,[{accessType:'read',recordType:'Steps'}]);
});
test('denied or revoked permission does not read steps or display fabricated zero',async()=>{
  const {bridge,calls}=fake({permissions:false});
  const value=await readTodaySteps(bridge,true,now);assert.equal(value.steps,null);assert.equal(value.status,'permission-required');assert.equal(calls.aggregate,undefined);
});
test('distinguishes no data, unsupported platform, unavailable provider, update and read error',async()=>{
  assert.equal((await readTodaySteps(fake({count:null}).bridge,false,now)).steps,0);
  assert.equal((await readTodaySteps(null,false,now)).status,'unsupported');
  assert.equal((await readTodaySteps(fake({sdk:1}).bridge,false,now)).status,'unavailable');
  assert.equal((await readTodaySteps(fake({sdk:2}).bridge,false,now)).status,'update-required');
  assert.equal((await readTodaySteps(fake({fail:true}).bridge,false,now)).steps,null);
  for(const count of [-1,NaN,Infinity,2.5])assert.equal((await readTodaySteps(fake({count}).bridge,false,now)).status,'error');
});
test('race-day boundaries use Pakistan midnight',()=>{
  const before=process.env.TZ;process.env.TZ='Asia/Karachi';
  try {
    const early=todayWindow(new Date('2026-10-15T19:01:00Z'));
    assert.equal(early.day,'2026-10-16');assert.equal(early.startTime,'2026-10-15T19:00:00.000Z');
    assert.equal(todayWindow(new Date('2026-10-16T19:01:00Z')).startTime,'2026-10-16T19:00:00.000Z');
  } finally {if(before===undefined)delete process.env.TZ;else process.env.TZ=before;}
});
