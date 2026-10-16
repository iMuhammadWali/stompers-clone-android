import React,{useEffect,useState} from 'react';
import {AccessibilityInfo,View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {trackSvg} from '../../lib/character/artwork';
import type {Appearance} from '../../lib/character/catalog';

export function TrackScene({appearance,walking=false}:{appearance:Appearance;walking?:boolean}) {
  const [frame,setFrame]=useState(0),[reduceMotion,setReduceMotion]=useState(true);
  useEffect(()=>{
    let active=true;
    void AccessibilityInfo.isReduceMotionEnabled().then(value=>{if(active)setReduceMotion(value);}).catch(()=>{});
    const subscription=AccessibilityInfo.addEventListener('reduceMotionChanged',setReduceMotion);
    return ()=>{active=false;subscription.remove();};
  },[]);
  useEffect(()=>{
    if(!walking||reduceMotion)return;
    const timer=setInterval(()=>setFrame(f=>(f+1)%8),140);
    return ()=>clearInterval(timer);
  },[walking,reduceMotion]);
  return <View accessible accessibilityRole="image" accessibilityLabel={`Your character wearing ${appearance.outfit} ${appearance.shirt}, with ${appearance.hair} hair${appearance.pet==='none'?'':` and a ${appearance.pet}`}, on the orange walking track. ${appearance.eyes} eyes, ${appearance.nose} nose, ${appearance.expression} expression`} style={{width:'100%',aspectRatio:390/420}}>
    <SvgXml xml={trackSvg(appearance,walking&&!reduceMotion?frame:0)} width="100%" height="100%" accessible={false}/>
  </View>;
}
