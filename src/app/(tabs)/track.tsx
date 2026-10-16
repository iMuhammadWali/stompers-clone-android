import React,{useState,useCallback} from 'react';
import {View} from 'react-native';
import {Text,useTheme,ActivityIndicator} from 'react-native-paper';
import {router,useFocusEffect} from 'expo-router';
import {Page,Mark,styles} from '../../components/ui';
import {AppButton} from '../../components/AppButton';
import {TrackScene} from '../../components/character/TrackScene';
import {useAppearance} from '../../lib/character/appearance';
import {useTodaySteps} from '../../lib/health/useTodaySteps';

export default function TrackScreen() {
  const {appearance,ready,loadError}=useAppearance(),theme=useTheme();
  const health=useTodaySteps();const {state,loading}=health;
  const [walking,setWalking]=useState(false);
  useFocusEffect(useCallback(()=>()=>setWalking(false),[]));
  const connected=state.status==='ready';
  const messages={
    unsupported:'Install the Android APK to connect Health Connect. The web preview cannot read your steps.',
    unavailable:'Health Connect is unavailable on this device. Android 9 or later is required.',
    'update-required':'Install or update Health Connect, then return here.',
    'permission-required':'Allow Stride to read Steps in Health Connect to start your personal race.',
    error:'Your steps could not be read. Try again, or check step access in Health Connect settings.',
    ready:state.steps===0?'No steps received today. Check that your health app is sharing Steps with Health Connect.':'Your step total from Health Connect. Only you are on this track.',
  };
  return <Page>
    <View style={[styles.brand,{justifyContent:'space-between',flexWrap:'wrap'}]}><View style={styles.brand}><Mark size={28}/><Text variant="titleMedium" style={{fontWeight:'800'}}>stride</Text></View><AppButton onPress={()=>router.push('/character')}>Edit character</AppButton></View>
    <View style={{gap:8}}><Text variant="headlineLarge" style={{fontWeight:'700'}}>Your daily race.</Text><Text variant="bodyLarge" style={{color:theme.colors.onSurfaceVariant}}>Today · {new Date().toLocaleDateString(undefined,{month:'short',day:'numeric'})}</Text></View>
    <View accessibilityLiveRegion="polite" style={{gap:4}}>
      <Text variant="displayLarge" accessibilityLabel={connected?`${state.steps} steps today`:'Steps not connected'} style={{fontWeight:'800',color:theme.colors.onSurface}}>{connected?state.steps!.toLocaleString():'—'}</Text>
      <Text variant="titleMedium">Steps today</Text>
      {loading&&<ActivityIndicator accessibilityLabel="Refreshing steps" style={{alignSelf:'flex-start'}}/>}
    </View>
    {!ready?<ActivityIndicator accessibilityLabel="Loading your character"/>:<View style={{borderRadius:28,overflow:'hidden',borderWidth:1,borderColor:theme.colors.outlineVariant}}><TrackScene appearance={appearance} walking={walking} stepCount={connected?state.steps:null}/></View>}
    <Text variant="bodyMedium" style={{color:theme.colors.onSurfaceVariant}}>{messages[state.status]}</Text>
    {state.updatedAt&&<Text variant="bodySmall" style={{color:theme.colors.onSurfaceVariant}}>Updated {new Date(state.updatedAt).toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'})} · Health Connect</Text>}
    {state.status==='permission-required'&&<AppButton mode="contained" onPress={()=>void health.connect()} disabled={loading} contentStyle={styles.button}>Connect Health Connect</AppButton>}
    {state.status==='update-required'&&<AppButton mode="contained" onPress={()=>void health.install()} contentStyle={styles.button}>Install or update Health Connect</AppButton>}
    <View style={styles.actions}>
      {state.status!=='unsupported'&&<AppButton mode="outlined" disabled={loading} onPress={()=>void health.refresh()} contentStyle={{minHeight:48}}>Refresh steps</AppButton>}
      {(connected||state.status==='permission-required'||state.status==='error')&&<AppButton onPress={()=>void health.settings()} contentStyle={{minHeight:48}}>Health Connect settings</AppButton>}
      <AppButton mode="outlined" onPress={()=>setWalking(w=>!w)} contentStyle={{minHeight:48}}>{walking?'Pause animation':'Animate character'}</AppButton>
    </View>
    <Text variant="bodySmall" style={{color:theme.colors.onSurfaceVariant}}>Read-only Steps access. Totals stay on your device. Your health app must share steps with Health Connect.</Text>
    {!!loadError&&<Text accessibilityLiveRegion="polite" style={{color:theme.colors.error}}>{loadError}</Text>}
  </Page>;
}
