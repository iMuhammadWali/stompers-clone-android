import {AppButton as Button} from './AppButton';
import React from 'react';
import {ScrollView,View,StyleSheet,RefreshControl} from 'react-native';
import {Text,Avatar,useTheme,Banner} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Svg,{Path,Ellipse} from 'react-native-svg';
import {useSession} from '../lib/session';
import {avatarColors} from '../lib/palette';

export function Mark({size=32,color}:{size?:number;color?:string}) {
  const theme=useTheme();
  return <Svg width={size} height={size} viewBox="0 0 40 40" accessibilityLabel="Stride">
    <Ellipse cx="13" cy="13" rx="5" ry="9" fill={color??theme.colors.primary} transform="rotate(-25 13 13)"/>
    <Ellipse cx="13" cy="28" rx="4" ry="5" fill={color??theme.colors.primary}/>
    <Ellipse cx="29" cy="21" rx="5" ry="9" fill={color??theme.colors.primary} transform="rotate(25 29 21)"/>
    <Ellipse cx="28" cy="35" rx="4" ry="4" fill={color??theme.colors.primary}/>
  </Svg>;
}
export function Icon({name,color,size=24}:{name:'track'|'friends'|'requests'|'profile';color:string;size?:number}) {
  const paths={track:'M3 10 L12 3 L21 10 M5 9v12h5v-7h4v7h5V9',friends:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M13 7a4 4 0 1 1-8 0a4 4 0 0 1 8 0',requests:'M22 3H2v14h5l5 4 5-4h5V3 M7 8h10 M7 12h6',profile:'M20 21v-2a7 7 0 0 0-14 0v2 M17 7a4 4 0 1 1-8 0a4 4 0 0 1 8 0'};
  return <Svg width={size} height={size} viewBox="0 0 24 24"><Path d={paths[name]} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"/></Svg>;
}
export function PersonAvatar({name,size=52}:{name:string;size?:number}) {
  const initials=name.split(/[ _\.]+/).map(s=>s[0]).slice(0,2).join('').toUpperCase();
  const palette=avatarColors.light;
  const index=Array.from(name).reduce((sum,c)=>sum+c.charCodeAt(0),0)%palette.length;
  const [background,foreground]=palette[index];
  return <Avatar.Text size={size} label={initials} style={{backgroundColor:background}} color={foreground}/>;
}
export function Page({children,refresh=false}:{children:React.ReactNode;refresh?:boolean}) {
  const {demo,error,reload,loading}=useSession(),theme=useTheme();
  return <SafeAreaView edges={['top','left','right']} style={{flex:1,backgroundColor:theme.colors.background}}>
    {demo&&<View style={[styles.demo,{backgroundColor:theme.colors.secondaryContainer}]}><Text variant="labelMedium" style={{color:theme.colors.onSecondaryContainer}}>Demo mode · Sample people</Text></View>}
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.page}
      refreshControl={refresh?<RefreshControl refreshing={loading} onRefresh={()=>void reload()} tintColor={theme.colors.primary}/>:undefined}>
      {error&&<Banner visible actions={[{label:'Retry',onPress:()=>void reload()}]}>{error}</Banner>}
      {children}
    </ScrollView>
  </SafeAreaView>;
}
export function Title({title,subtitle,action}:{title:string;subtitle?:string;action?:React.ReactNode}) {
  const theme=useTheme();
  return <View style={styles.title}><View style={{flex:1,gap:8}}><Text variant="headlineLarge" style={{fontWeight:'700',letterSpacing:-0.8}}>{title}</Text>{subtitle&&<Text variant="bodyLarge" style={{color:theme.colors.onSurfaceVariant}}>{subtitle}</Text>}</View>{action}</View>;
}
export function Empty({title,body,action}:{title:string;body:string;action?:React.ReactNode}) {
  const theme=useTheme();
  return <View style={{paddingVertical:36,gap:12}}><Text variant="titleLarge">{title}</Text><Text variant="bodyLarge" style={{color:theme.colors.onSurfaceVariant,lineHeight:25}}>{body}</Text>{action}</View>;
}
export function Notice({text}:{text:string}) {const theme=useTheme();return text?<Text accessibilityLiveRegion="polite" variant="bodyMedium" style={{color:theme.colors.error,marginVertical:12}}>{text}</Text>:null;}
export function SmallAction({label,onPress,disabled=false}:{label:string;onPress:()=>void;disabled?:boolean}) {return <Button mode="text" onPress={onPress} disabled={disabled} contentStyle={{minHeight:48}}>{label}</Button>;}
export const styles=StyleSheet.create({page:{padding:24,paddingBottom:40,gap:20,maxWidth:600,width:'100%',alignSelf:'center'},title:{flexDirection:'row',alignItems:'center',gap:12,marginTop:12,marginBottom:4},demo:{paddingHorizontal:20,paddingVertical:10},row:{flexDirection:'row',alignItems:'center',gap:16,paddingVertical:18},grow:{flex:1,gap:4},actions:{flexDirection:'row',gap:8,flexWrap:'wrap'},section:{marginTop:12},form:{gap:16},button:{minHeight:52},brand:{flexDirection:'row',alignItems:'center',gap:10}});
