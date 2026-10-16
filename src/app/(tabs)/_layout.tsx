import React from 'react';
import {Tabs,Redirect} from 'expo-router';
import {useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSession} from '../../lib/session';
import {Icon} from '../../components/ui';

export default function TabsLayout() {
  const {user,pending}=useSession(),theme=useTheme(),insets=useSafeAreaInsets();
  if(!user) return <Redirect href="/"/>;
  const count=pending.filter(r=>r.recipientId===user.id).length;
  return <Tabs screenOptions={{headerShown:false,tabBarActiveTintColor:theme.colors.primary,tabBarInactiveTintColor:theme.colors.onSurfaceVariant,
    tabBarStyle:{backgroundColor:theme.colors.surface,borderTopColor:theme.colors.outlineVariant,height:72+insets.bottom,paddingTop:10,paddingBottom:Math.max(insets.bottom,10)},tabBarLabelStyle:{fontSize:12,fontWeight:'600'}}}>
    <Tabs.Screen name="track" options={{title:'Home',tabBarIcon:({color})=><Icon name="track" color={typeof color==='string'?color:theme.colors.primary}/>}}/>
    <Tabs.Screen name="friends" options={{title:'Friends',tabBarIcon:({color})=><Icon name="friends" color={typeof color==='string'?color:theme.colors.primary}/>}}/>
    <Tabs.Screen name="requests" options={{title:'Requests',tabBarBadge:count||undefined,tabBarIcon:({color})=><Icon name="requests" color={typeof color==='string'?color:theme.colors.primary}/>}}/>
    <Tabs.Screen name="profile" options={{title:'You',tabBarIcon:({color})=><Icon name="profile" color={typeof color==='string'?color:theme.colors.primary}/>}}/>
  </Tabs>;
}
