import React from 'react';
import {View} from 'react-native';
import {Tabs,Redirect} from 'expo-router';
import {useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSession} from '../../lib/session';
import {GameIcon} from '../../components/GameChrome';

export default function TabsLayout() {
  const {user,pending,demo}=useSession(),theme=useTheme(),insets=useSafeAreaInsets();
  if(!user) return <Redirect href="/"/>;
  if(!demo&&user.onboardingComplete!==true)return <Redirect href="/onboarding"/>;
  const count=pending.filter(r=>r.recipientId===user.id).length;
  return <Tabs screenOptions={{headerShown:false,tabBarActiveTintColor:theme.colors.primary,tabBarInactiveTintColor:theme.colors.onSurfaceVariant,
    tabBarStyle:{backgroundColor:theme.colors.surface,borderTopColor:theme.colors.outlineVariant,height:74+insets.bottom,paddingTop:6,paddingBottom:Math.max(insets.bottom,8)},tabBarLabelStyle:{fontSize:11,fontWeight:'700'}}}>
    <Tabs.Screen name="track" options={{title:'Home',tabBarIcon:({focused})=><View style={{width:64,height:34,borderRadius:22,alignItems:'center',justifyContent:'center',backgroundColor:focused?theme.colors.secondaryContainer:'transparent'}}><GameIcon name="track" size={30}/></View>}}/>
    <Tabs.Screen name="friends" options={{title:'Friends',tabBarIcon:({focused})=><View style={{width:64,height:34,borderRadius:22,alignItems:'center',justifyContent:'center',backgroundColor:focused?theme.colors.secondaryContainer:'transparent'}}><GameIcon name="friends" size={30}/></View>}}/>
    <Tabs.Screen name="requests" options={{title:'Requests',tabBarBadge:count||undefined,tabBarIcon:({focused})=><View style={{width:64,height:34,borderRadius:22,alignItems:'center',justifyContent:'center',backgroundColor:focused?theme.colors.secondaryContainer:'transparent'}}><GameIcon name="requests" size={30}/></View>}}/>
    <Tabs.Screen name="profile" options={{title:'You',tabBarIcon:({focused})=><View style={{width:64,height:34,borderRadius:22,alignItems:'center',justifyContent:'center',backgroundColor:focused?theme.colors.secondaryContainer:'transparent'}}><GameIcon name="profile" size={30}/></View>}}/>
  </Tabs>;
}
