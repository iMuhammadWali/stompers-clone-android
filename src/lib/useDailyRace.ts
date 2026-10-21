import {stepUpload} from './step-upload';
import {useCallback,useEffect,useRef,useState} from 'react';
import {AppState} from 'react-native';
import {useFocusEffect} from 'expo-router';
import {useSession,message} from './session';
import {raceWindow} from './race-time';
import type {StepState} from './health/service';
import type {PhoneSnapshot} from './health/phone';
import type {DailyRace} from './types';


export function useDailyRace(state:StepState,phone:PhoneSnapshot|null|undefined) {
  const {service,user,demo}=useSession();
  const userId=user?.id;
  const [race,setRace]=useState<DailyRace|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState('');
  const latest=useRef({state,phone});
  useEffect(()=>{latest.current={state,phone};},[state,phone]);
  const refreshRef=useRef<()=>Promise<void>>(async()=>{});
  useFocusEffect(useCallback(()=>{
    if(!service||!userId)return;
    let active=true,running=false;
    async function refresh() {
      if(running||AppState.currentState!=='active')return;
      running=true;setBusy(true);
      const now=new Date();
      setRace(previous=>previous?.day===raceWindow(now).day?previous:null);
      let syncError='';
      try {
        const upload=stepUpload(latest.current.state,latest.current.phone,now);
        if(upload&&!demo) {
          try {await service!.syncSteps(upload);} catch(e) {syncError='Your steps could not sync. '+message(e);}
        }
        const result=await service!.dailyRace();
        if(active){setRace(result);setError(syncError);}
      } catch(e) {if(active){setRace(null);setError(message(e));}}
      finally {running=false;if(active)setBusy(false);}
    }
    refreshRef.current=refresh;
    void refresh();
    const timer=setInterval(()=>void refresh(),15000);
    const listener=AppState.addEventListener('change',status=>{if(status==='active')void refresh();});
    return ()=>{active=false;clearInterval(timer);listener.remove();refreshRef.current=async()=>{};};
  },[service,userId,demo]));
  return {race,busy,error,refresh:()=>refreshRef.current()};
}
