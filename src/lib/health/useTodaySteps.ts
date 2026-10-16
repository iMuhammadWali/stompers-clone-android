import {useCallback,useRef,useState} from 'react';
import {AppState,Linking} from 'react-native';
import {useFocusEffect} from 'expo-router';
import {getHealthBridge} from './platform';
import {readTodaySteps,todayWindow,type StepState} from './service';
export function useTodaySteps() {
  const [state,setState]=useState<StepState>({status:'permission-required',steps:null,updatedAt:null,day:todayWindow(new Date()).day});
  const [loading,setLoading]=useState(false),generation=useRef(0);
  const refresh=useCallback(async(ask=false)=>{
    const current=++generation.current;setLoading(true);
    const day=todayWindow(new Date()).day;setState(previous=>previous.day===day?previous:{status:'permission-required',steps:null,updatedAt:null,day});
    const result=await readTodaySteps(await getHealthBridge(),ask);
    if(generation.current===current){setState(result);setLoading(false);}
  },[]);
  useFocusEffect(useCallback(()=>{
    void refresh();
    const listener=AppState.addEventListener('change',status=>{if(status==='active')void refresh();});
    const timer=setInterval(()=>{if(AppState.currentState==='active')void refresh();},60000);
    return ()=>{generation.current++;listener.remove();clearInterval(timer);};
  },[refresh]));
  async function settings(){try {const bridge=await getHealthBridge();bridge?.openHealthConnectSettings();}catch {await refresh();}}
  async function install(){await Linking.openURL('https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata').catch(()=>{});}
  return {state,loading,refresh:()=>refresh(),connect:()=>refresh(true),settings,install};
}
