import {raceWindow} from '../race-time';
export type HealthPermission={accessType:string;recordType?:string};
export type StepRequest={recordType:'Steps';timeRangeFilter:{operator:'between';startTime:string;endTime:string}};
export interface HealthBridge {
  getSdkStatus():Promise<number>;
  initialize():Promise<boolean>;
  getGrantedPermissions():Promise<HealthPermission[]>;
  requestPermission(permissions:{accessType:'read';recordType:'Steps'}[]):Promise<HealthPermission[]>;
  aggregateRecord(request:StepRequest):Promise<{COUNT_TOTAL?:number|null}>;
  openHealthConnectSettings():void;
}
export type HealthStatus='unsupported'|'unavailable'|'update-required'|'permission-required'|'ready'|'error';
export type StepState={status:HealthStatus;steps:number|null;updatedAt:string|null;day:string};
export const stepPermission={accessType:'read',recordType:'Steps'} as const;
export function todayWindow(now:Date) {
  const {startTime,endTime,day}=raceWindow(now);
  return {startTime,endTime,day};
}
export async function readTodaySteps(bridge:HealthBridge|null,askPermission=false,now=new Date()):Promise<StepState> {
  const window=todayWindow(now);
  const state=(status:HealthStatus,steps:number|null=null):StepState=>({status,steps,day:window.day,updatedAt:status==='ready'?window.endTime:null});
  if(!bridge)return state('unsupported');
  try {
    const sdk=await bridge.getSdkStatus();
    if(sdk===2)return state('update-required');
    if(sdk!==3||!await bridge.initialize())return state('unavailable');
    let permissions=await bridge.getGrantedPermissions();
    const allowed=()=>permissions.some(p=>p.accessType==='read'&&p.recordType==='Steps');
    if(!allowed()&&askPermission)permissions=await bridge.requestPermission([stepPermission]);
    if(!allowed())return state('permission-required');
    if(window.startTime===window.endTime)return state('ready',0);
    const result=await bridge.aggregateRecord({recordType:'Steps',timeRangeFilter:{operator:'between',startTime:window.startTime,endTime:window.endTime}});
    const count=result.COUNT_TOTAL??0;
    if(!Number.isSafeInteger(count)||count<0)throw new Error('Invalid step aggregate');
    return state('ready',count);
  } catch {return state('error');}
}
