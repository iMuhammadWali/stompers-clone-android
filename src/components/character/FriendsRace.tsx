import React,{useState} from 'react';
import {View} from 'react-native';
import {Text,useTheme} from 'react-native-paper';
import {SvgXml} from 'react-native-svg';
import {characterLayers,petLayers,sceneColors} from '../../lib/character/artwork';
import {parseAppearance} from '../../lib/character/catalog';
import {AppButton} from '../AppButton';
import {router} from 'expo-router';
import type {DailyRace} from '../../lib/types';

function syncLabel(value:string|null) {
  if(!value)return 'Not synced today';
  const minutes=Math.max(0,Math.floor((Date.now()-Date.parse(value))/60000));
  return minutes<1?'Synced just now':minutes===1?'Synced 1 minute ago':`Synced ${minutes} minutes ago`;
}
export function FriendsRace({race,selfId,demo=false}:{race:DailyRace;selfId:string;demo?:boolean}) {
  const {colors}=useTheme(),[width,setWidth]=useState(320);
  const highest=Math.max(10000,...race.data.map(p=>p.steps??0));
  return <View style={{paddingHorizontal:20,paddingBottom:24,gap:12}}>
    <Text variant="titleLarge" style={{fontFamily:'LilitaOne'}}>Your daily race</Text>
    <Text variant="bodySmall" style={{color:colors.onSurfaceVariant}}>{demo?'Demo people · step totals are not simulated.':'Accepted friends · refreshes every 15 seconds while open.'} Resets at midnight Pakistan time.</Text>
    {race.data.map((player,index)=>{
      const appearance=parseAppearance(JSON.stringify(player.appearance??null));
      const progress=Math.max(0,Math.min(1,(player.steps??0)/highest));
      const x=12+progress*Math.max(0,width-112);
      const scene=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="98" viewBox="0 0 ${width} 98"><path d="M0 72 Q80 66 ${width} 74 V98 H0 Z" fill="${sceneColors.edge}"/><path d="M0 74 H${width} V89 H0 Z" fill="${sceneColors.track}"/><path d="M0 82 H${width}" stroke="${sceneColors.ink}" stroke-opacity=".25" stroke-dasharray="5 8"/><g transform="translate(${x},8) scale(.41)">${characterLayers(appearance)}</g><g transform="translate(${x+60},56) scale(.36)">${petLayers(appearance.pet)}</g></svg>`;
      return <View key={player.id} style={{paddingTop:12,borderTopWidth:1,borderColor:colors.outlineVariant,gap:4}}>
        <View style={{flexDirection:'row',alignItems:'flex-start',gap:12}}>
          <Text accessibilityLabel={player.steps===null?'Unranked':`Position ${index+1}`} variant="titleMedium">{player.steps===null?'—':index+1}</Text>
          <View style={{flex:1,gap:2}}><Text variant="titleMedium">{player.displayName}{player.id===selfId?' · You':''}</Text><Text variant="bodySmall" style={{color:colors.onSurfaceVariant}}>@{player.username}</Text></View>
          <Text accessibilityLabel={`${player.username}: ${player.steps===null?'steps not synced':player.steps+' steps'}`} variant="titleMedium">{player.steps===null?'···':player.steps.toLocaleString()}</Text>
        </View>
        <View onLayout={event=>{const next=Math.round(event.nativeEvent.layout.width);if(next>0)setWidth(next);}} accessible accessibilityRole="image" accessibilityLabel={`${player.displayName} and companion on the daily race track`}>
          <SvgXml xml={scene} width="100%" height={98} accessible={false}/>
        </View>
        <Text variant="bodySmall" style={{color:colors.onSurfaceVariant}}>{syncLabel(player.lastSyncedAt)}{player.source==='phone-estimate'?' · Experimental estimate':''}</Text>
      </View>;
    })}
    {race.data.length<=1&&<><Text variant="bodyMedium">A little company goes a long way. Add a friend; they’ll join this race when they accept.</Text><AppButton mode="outlined" onPress={()=>router.push('/add-friend')} contentStyle={{minHeight:48}}>Find a friend</AppButton></>}
  </View>;
}
