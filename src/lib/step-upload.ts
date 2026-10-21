import {raceWindow} from './race-time';
import type {StepState} from './health/service';
import type {PhoneSnapshot} from './health/phone';
import type {StepUpload} from './types';

export function stepUpload(state:StepState,phone:PhoneSnapshot|null|undefined,now=new Date()):StepUpload|null {
  if(state.status!=='ready'||state.steps===null||!state.updatedAt||state.day!==raceWindow(now).day)return null;
  if(now.getTime()-Date.parse(state.updatedAt)>300000)return null;
  const source=phone?.source==='phone'?`phone-${phone.mode}` as StepUpload['source']:'health-connect';
  return {day:state.day,steps:state.steps,source,observedAt:state.updatedAt};
}

