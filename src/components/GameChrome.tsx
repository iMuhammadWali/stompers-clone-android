import React from 'react';
import {View,Pressable,StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import Svg,{Text as SvgText,SvgXml} from 'react-native-svg';
import {lightColors,brandColors} from '../lib/palette';
export function GameText({text,width=220,height=30,size=24}:{text:string;width?:number;height?:number;size?:number}) {
  return <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} accessible={false}>
    <SvgText x={width/2} y={height*.78} textAnchor="middle" fontFamily="LilitaOne" fontSize={size} fill={lightColors.surface} stroke={brandColors.ink} strokeWidth={size>60?5:2.6} strokeLinejoin="round">{text}</SvgText>
    <SvgText x={width/2} y={height*.78} textAnchor="middle" fontFamily="LilitaOne" fontSize={size} fill={lightColors.surface}>{text}</SvgText>
  </Svg>;
}
export function RoundControl({label,children,onPress,orange=false,disabled=false}:{label:string;children:React.ReactNode;onPress:()=>void;orange?:boolean;disabled?:boolean}) {
  const {colors}=useTheme();return <Pressable accessibilityRole="button" accessibilityLabel={label} disabled={disabled} onPress={onPress} style={({pressed})=>[g.round,{backgroundColor:orange?colors.primaryContainer:colors.surfaceVariant,borderColor:orange?colors.onSurface:'transparent',opacity:disabled?.45:pressed?.7:1}]}>{children}</Pressable>;
}
export function GameIcon({name,size=30}:{name:'track'|'friends'|'requests'|'profile'|'menu'|'refresh';size?:number}) {
  const ink=brandColors.ink,orange=brandColors.action,cyan='#2CD8D9',yellow=lightColors.tertiaryContainer;
  const parts={
    track:`<path d="M7 20L24 5L41 20V43H7Z" fill="${orange}"/><path d="M3 22L24 3L45 22L41 27L24 12L7 27Z" fill="#F17D36"/><path d="M14 23H35V43H14Z" fill="${cyan}"/><path d="M22 30H30V43H22Z" fill="${yellow}"/><path d="M10 42H39V46H10Z" fill="#7FC96E"/>`,
    friends:`<circle cx="24" cy="25" r="20" fill="${cyan}"/><path d="M9 35Q14 25 22 32L20 43H12Z" fill="${orange}"/><path d="M28 33Q35 24 41 35L36 43H28Z" fill="${yellow}"/><circle cx="17" cy="20" r="8" fill="#F8D6BA"/><circle cx="33" cy="20" r="8" fill="#D79B6E"/><path d="M10 18Q9 7 19 11L24 17M26 17Q26 8 35 11L41 19" fill="${ink}"/>`,
    requests:`<rect x="7" y="12" width="34" height="29" rx="6" fill="${orange}" transform="rotate(-8 24 27)"/><path d="M8 17L25 30L40 15" fill="${yellow}"/><path d="M13 6H36V23L30 28H13Z" fill="${cyan}"/><path d="M19 12H30M19 17H27" fill="none"/>`,
    profile:`<circle cx="24" cy="24" r="21" fill="${cyan}"/><path d="M9 42Q11 27 24 27Q38 27 40 42" fill="${yellow}"/><circle cx="24" cy="18" r="9" fill="${yellow}"/>`,
    menu:`<rect x="9" y="11" width="30" height="26" rx="6" fill="${ink}"/><path d="M15 18H33M15 24H33M15 30H33" stroke="#FFFFFF" stroke-width="3.2"/>`,
    refresh:'<path d="M38 21A15 15 0 1 0 36 35M38 10V22H26" fill="none" stroke-width="4"/>',
  };
  const xml=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><g stroke="${ink}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${parts[name]}</g>${['menu','refresh'].includes(name)?'':'<path d="M12 12Q17 7 23 8" fill="none" stroke="#FFFFFF" opacity=".65" stroke-width="3" stroke-linecap="round"/>'}</svg>`;
  return <View accessible={false}><SvgXml xml={xml} width={size} height={size} accessible={false}/></View>;
}
const g=StyleSheet.create({round:{width:44,height:44,borderRadius:24,borderWidth:2,alignItems:'center',justifyContent:'center'}});
