import {useCallback,useRef,useState} from 'react';
import {AppState,Linking} from 'react-native';
import {getPhoneBridge,requestActivityPermission,type PhoneSnapshot} from './phone';
import {useFocusEffect} from 'expo-router';
import {getHealthBridge} from './platform';
import {readTodaySteps,todayWindow,type StepState} from './service';
export function useTodaySteps() {
  const [state,setState]=useState<StepState>({status:'permission-required',steps:null,updatedAt:null,day:todayWindow(new Date()).day});
  const [phone,setPhone]=useState<PhoneSnapshot|null>(null),[phoneError,setPhoneError]=useState<string|null>(null),[canEstimate,setCanEstimate]=useState(false);
  const [loading,setLoading]=useState(false),generation=useRef(0),phoneSource=useRef(false),actionBusy=useRef(false);
  const refresh=useCallback(async(ask=false)=>{
    const current=++generation.current;setLoading(true);
    const day=todayWindow(new Date()).day;setState(previous=>previous.day===day?previous:{status:'permission-required',steps:null,updatedAt:null,day});
    let snapshot:PhoneSnapshot|null=null,readError=false;
    try{snapshot=await getPhoneBridge()?.snapshot()??null;}catch{readError=true;setPhoneError('Phone tracking status could not be read.');}
    let result:StepState={status:'error',steps:null,day,updatedAt:null};
    if(!readError){try{result=snapshot?.source==='phone'?{status:'ready',steps:snapshot.steps,day:snapshot.day,updatedAt:new Date().toISOString()}:await readTodaySteps(await getHealthBridge(),ask);}catch{/* A failed native bridge must not leave a stale total visible. */}}
    if(generation.current===current){phoneSource.current=snapshot?.source==='phone';setPhone(snapshot);setState(result);if(!actionBusy.current)setLoading(false);}
  },[]);
  useFocusEffect(useCallback(()=>{
    void refresh();
    const listener=AppState.addEventListener('change',status=>{if(status==='active')void refresh();});
    let ticks=0,observedDay=todayWindow(new Date()).day;
    const timer=setInterval(()=>{
      ticks++;
      const day=todayWindow(new Date()).day,rolled=day!==observedDay;observedDay=day;
      if(AppState.currentState==='active'&&(rolled||phoneSource.current||ticks%12===0))void refresh();
    },5000);
    return ()=>{generation.current++;listener.remove();clearInterval(timer);};
  },[refresh]));
  async function settings(){try {if(phone?.source==='phone'||phoneError?.includes('Physical activity')){await Linking.openSettings();return;}const bridge=await getHealthBridge();bridge?.openHealthConnectSettings();}catch {setPhoneError('Settings could not be opened. Open Android Settings, then Apps, Stride, Permissions.');}}
  async function install(){await Linking.openURL('https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata').catch(()=>{});}
  async function startPhone(estimate=false){
    if(actionBusy.current)return;actionBusy.current=true;
    setLoading(true);setPhoneError(null);
    try{const bridge=getPhoneBridge();if(!bridge)throw new Error('Phone tracking requires the updated Android APK.');
      const caps=await bridge.capabilities();
      if(!caps.counter&&!caps.detector&&!estimate){setCanEstimate(caps.estimate);throw new Error(caps.estimate?'No hardware step sensor. You can opt into experimental estimation below.':'This phone has no supported movement sensor.');}
      if(!await requestActivityPermission())throw new Error('Allow Physical activity in Android app permissions to count steps.');
      await bridge.start(estimate);setCanEstimate(false);
    }catch(error){setPhoneError(error instanceof Error?error.message:'Phone tracking could not start.');}
    await refresh();actionBusy.current=false;setLoading(false);
  }
  async function stopPhone(){if(actionBusy.current)return;actionBusy.current=true;setLoading(true);try{await getPhoneBridge()?.stop();}catch{setPhoneError('Could not stop phone tracking. Use Stop in its Android notification.');}await refresh();actionBusy.current=false;setLoading(false);}
  async function useHealth(){if(actionBusy.current)return;actionBusy.current=true;setLoading(true);try{await getPhoneBridge()?.useHealth();setPhoneError(null);}catch{setPhoneError('Could not switch step source.');}await refresh();actionBusy.current=false;setLoading(false);}
  return {state,loading,phone,phoneError,canEstimate,startPhone,stopPhone,useHealth,refresh:()=>refresh(),connect:()=>refresh(true),settings,install};
}
