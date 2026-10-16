import React,{useState,useCallback} from 'react';
import {View} from 'react-native';
import {Text,useTheme,ActivityIndicator} from 'react-native-paper';
import {router,useFocusEffect} from 'expo-router';
import {Page,Mark,styles} from '../../components/ui';
import {AppButton} from '../../components/AppButton';
import {TrackScene} from '../../components/character/TrackScene';
import {useAppearance} from '../../lib/character/appearance';
import {pets} from '../../lib/character/catalog';

export default function TrackScreen() {
  const {appearance,ready,loadError}=useAppearance(),theme=useTheme();
  const [walking,setWalking]=useState(false);
  useFocusEffect(useCallback(()=>()=>setWalking(false),[]));
  const companion=pets.find(p=>p.id===appearance.pet)!;
  return <Page>
    <View style={[styles.brand,{justifyContent:'space-between'}]}><View style={styles.brand}><Mark size={28}/><Text variant="titleMedium" style={{fontWeight:'800'}}>stride</Text></View><AppButton onPress={()=>router.push('/character')}>Edit character</AppButton></View>
    <View style={{gap:8}}><Text variant="headlineLarge" style={{fontWeight:'700',letterSpacing:-0.8}}>A little adventure.</Text><Text variant="bodyLarge" style={{color:theme.colors.onSurfaceVariant}}>{appearance.pet==='none'?'Your own pace. Your own path.':`Every walk is better with ${companion.label}.`}</Text></View>
    {!ready?<ActivityIndicator accessibilityLabel="Loading your character"/>:<>
      <View style={{borderRadius:28,overflow:'hidden',borderWidth:1,borderColor:theme.colors.outlineVariant}}><TrackScene appearance={appearance} walking={walking}/></View>
      <View style={[styles.actions,{justifyContent:'space-between',alignItems:'center'}]}><View style={{gap:3}}><Text variant="titleMedium">{appearance.pet==='none'?'Ready when you are.':`You + ${companion.label}`}</Text><Text variant="bodySmall" style={{color:theme.colors.onSurfaceVariant}}>Track preview · Step tracking comes later</Text></View><AppButton mode="outlined" onPress={()=>setWalking(w=>!w)}>{walking?'Pause':'Preview walk'}</AppButton></View>
      {!!loadError&&<Text accessibilityLiveRegion="polite" style={{color:theme.colors.error}}>{loadError}</Text>}
      <AppButton mode="contained" onPress={()=>router.push('/character')} contentStyle={styles.button}>Make it yours</AppButton>
    </>}
  </Page>;
}
