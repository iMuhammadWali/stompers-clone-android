import React,{useEffect,useState} from 'react';
import {AccessibilityInfo,View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {trackSvg,raceSvg} from '../../lib/character/artwork';
import type {Appearance} from '../../lib/character/catalog';

export function TrackScene({appearance,walking=false,compact=false,height,stepCount,race=false,fill=false}:{appearance:Appearance;walking?:boolean;compact?:boolean;height?:number;stepCount?:number|null;race?:boolean;fill?:boolean}) {
  const [raceSize,setRaceSize]=useState({width:390,height:315});
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
  return <View onLayout={race?event=>{const {width,height}=event.nativeEvent.layout;if(width>0&&height>0)setRaceSize(previous=>previous.width===width&&previous.height===height?previous:{width,height});}:undefined} accessible accessibilityRole="image" accessibilityLabel={`Your character wearing ${appearance.outfit} ${appearance.shirt}, with ${appearance.hair} hair${appearance.pet==='none'?'':` and a ${appearance.pet}`}, on the orange walking track. ${appearance.eyes} eyes, ${appearance.nose} nose, ${appearance.expression} expression${appearance.eyewear==='sunglasses'?', wearing sunglasses':''}`} style={[{width:'100%'},fill?{height:'100%'}:height?{height}:{aspectRatio:compact?390/280:390/420}]}>
    <SvgXml xml={race?raceSvg(appearance,walking&&!reduceMotion?frame:0,stepCount,raceSize):compact?trackSvg(appearance,walking&&!reduceMotion?frame:0,stepCount).replace('viewBox="0 0 390 420"','viewBox="0 140 390 280"'):trackSvg(appearance,walking&&!reduceMotion?frame:0,stepCount)} width="100%" height="100%" accessible={false}/>
  </View>;
}
