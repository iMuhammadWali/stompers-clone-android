import React,{useRef} from 'react';
import {ScrollView,View} from 'react-native';
import {Text,useTheme} from 'react-native-paper';
import {SvgXml} from 'react-native-svg';
import {AppButton} from '../AppButton';
import {characterLayers,petLayers,sceneColors} from '../../lib/character/artwork';
import {parseAppearance} from '../../lib/character/catalog';
import type {DailyRace} from '../../lib/types';

export function racePositions(race:DailyRace) {
  let previous=-145;
  return [...race.data].sort((a,b)=>(a.steps??-1)-(b.steps??-1)||a.username.localeCompare(b.username)).map(player=>{
    const x=Math.max(previous+145,40+Math.min(player.steps??0,200000)*.035);previous=x;
    return {player,x};
  });
}
export function SharedTrack({race,selfId}:{race:DailyRace;selfId:string}) {
  const {colors}=useTheme(),scroll=useRef<ScrollView>(null);
  const positions=racePositions(race),width=Math.max(700,...positions.map(p=>p.x+170));
  const self=positions.find(p=>p.player.id===selfId);
  const scene=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 285"><defs><linearGradient id="ground" x2="0" y2="1"><stop stop-color="${sceneColors.edge}"/><stop offset="1" stop-color="${sceneColors.sky}"/></linearGradient></defs><path d="M0 153 Q200 143 ${width} 153 V285 H0Z" fill="url(#ground)"/><path d="M0 168 Q200 158 ${width} 168 V225 H0Z" fill="${sceneColors.track}"/><path d="M0 218 H${width}" stroke="${sceneColors.lane}" stroke-width="2" stroke-dasharray="16 12"/></svg>`;
  return <View style={{flex:1}}>
    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,gap:8}}><Text variant="bodySmall" style={{color:colors.onSurfaceVariant}}>Swipe to explore · {race.data.length} walkers</Text><AppButton accessibilityLabel="Find me on the track" onPress={()=>scroll.current?.scrollTo({x:Math.max(0,(self?.x??0)-60),animated:true})}>Find me</AppButton></View>
    <ScrollView ref={scroll} horizontal nestedScrollEnabled showsHorizontalScrollIndicator accessibilityLabel="Explore friends on the walking track" contentContainerStyle={{width,height:285}}>
      <View style={{position:'absolute',inset:0}} pointerEvents="none"><SvgXml xml={scene} width={width} height={285} accessible={false}/></View>
      {positions.map(({player,x})=>{
        const appearance=parseAppearance(JSON.stringify(player.appearance??null));
        const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -24 130 224">${characterLayers(appearance)}</svg>`;
        const pet=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -10 100 90">${petLayers(appearance.pet)}</svg>`;
        return <View key={player.id} accessible accessibilityLabel={`${player.displayName}${player.id===selfId?', you':''}: ${player.steps===null?'steps not synced':player.steps.toLocaleString()+' steps'}`} style={{position:'absolute',left:x,top:14,width:132,alignItems:'center'}}>
          <Text numberOfLines={1} style={{fontWeight:'700',color:colors.onSurface,fontSize:13}}>{player.id===selfId?'You':player.displayName}</Text>
          <Text style={{fontSize:12,color:colors.onSurfaceVariant}}>{player.steps===null?'Not synced':player.steps.toLocaleString()+' steps'}</Text>
          <SvgXml xml={svg} width={100} height={170} accessible={false}/>
          {appearance.pet!=='none'&&<View style={{position:'absolute',left:81,top:145}}><SvgXml xml={pet} width={55} height={50} accessible={false}/></View>}
        </View>;
      })}
    </ScrollView>
  </View>;
}
