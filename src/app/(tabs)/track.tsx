import React,{useState} from 'react';
import {View,ScrollView,StyleSheet,Pressable} from 'react-native';
import {Text,useTheme,ActivityIndicator} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Svg,{Path,Text as SvgText,SvgXml} from 'react-native-svg';
import {router} from 'expo-router';
import {Mark} from '../../components/ui';
import {AppButton} from '../../components/AppButton';
import {TrackScene} from '../../components/character/TrackScene';
import {useAppearance} from '../../lib/character/appearance';
import {portraitSvg} from '../../lib/character/artwork';
import {useTodaySteps} from '../../lib/health/useTodaySteps';

const DAILY_TARGET=10000;
function RefreshIcon({color}:{color:string}) {
  return <Svg width={20} height={20} viewBox="0 0 24 24" accessible={false}><Path d="M20 10a8 8 0 1 0-1 8 M20 4v6h-6" fill="none" stroke={color} strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round"/></Svg>;
}

export default function TrackScreen() {
  const {appearance,ready,loadError}=useAppearance(),{colors}=useTheme();
  const health=useTodaySteps(),{state,loading}=health;
  const [details,setDetails]=useState(false);
  const connected=state.status==='ready',steps=connected?state.steps!:null;
  const total=steps===null?'···':steps.toLocaleString();
  const percent=steps===null?0:Math.min(100,steps/DAILY_TARGET*100);
  const statusText={
    unsupported:'Health Connect works in the Android APK. The web preview cannot read your steps.',
    unavailable:'Health Connect is unavailable. It requires Android 9 or later and a supported device.',
    'update-required':'Install or update Health Connect to read your steps.',
    'permission-required':'Allow read access to Steps. Your health app must share steps with Health Connect.',
    error:'Steps could not be read. Check access in Health Connect, then refresh.',
    ready:steps===0?'No steps received today. Check that your health app is sharing Steps with Health Connect.':'Your step total from Health Connect. Only you are on this track.',
  }[state.status];
  const heading={unsupported:'Open the Android app',unavailable:'Steps unavailable','update-required':'Set up Health Connect','permission-required':'Connect to see steps',error:'Couldn’t refresh steps',ready:steps===0?'Waiting for shared steps':'Connected to Health Connect'}[state.status];
  const showStatus=!connected||steps===0||details;
  return <SafeAreaView edges={['top','left','right']} style={[s.screen,{backgroundColor:colors.background}]}>
    <ScrollView testID="race-scroll" contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <View style={s.wordmark}><Mark size={25}/><Text style={[s.logo,{color:colors.onSurface}]}>STRIDE</Text></View>
        <AppButton mode="outlined" accessibilityLabel="Edit character" onPress={()=>router.push('/character')} contentStyle={{minHeight:44}} style={{backgroundColor:colors.surface,borderColor:colors.outlineVariant}}>Edit character</AppButton>
      </View>
      <View style={s.score}>
        <Text variant="labelLarge" style={{color:colors.onSurfaceVariant,letterSpacing:1}}>TODAY’S WALK · {new Date().toLocaleDateString(undefined,{month:'short',day:'numeric'}).toUpperCase()}</Text>
        <View accessible accessibilityLiveRegion="polite" accessibilityLabel={connected?`${steps} steps today`:'Steps not connected'} style={s.counter}>
          <Svg width="100%" height="96" viewBox="0 0 390 105" accessible={false}>
            <SvgText x="195" y="85" textAnchor="middle" fontFamily="sans-serif" fontSize={Math.min(90,620/total.length)} fontWeight="900" fill={colors.surface} stroke={colors.onSurface} strokeWidth="5" strokeLinejoin="round">{total}</SvgText>
            <SvgText x="195" y="85" textAnchor="middle" fontFamily="sans-serif" fontSize={Math.min(90,620/total.length)} fontWeight="900" fill={colors.surface}>{total}</SvgText>
          </Svg>
        </View>
        <Text variant="titleSmall" style={{color:colors.onSurfaceVariant}}>{connected?'steps today · your personal race':'Your step count is not connected'}</Text>
      </View>
      {showStatus&&<View testID="step-connection-panel" style={[s.connection,{backgroundColor:colors.surface,borderColor:colors.outlineVariant}]}>
        <Text variant="titleSmall" style={{fontWeight:'800'}}>{heading}</Text>
        <Text variant="bodySmall" style={{color:colors.onSurfaceVariant,lineHeight:18}}>{statusText}</Text>
        {state.status==='permission-required'&&<AppButton mode="contained" onPress={()=>void health.connect()} disabled={loading} loading={loading} contentStyle={{minHeight:44}}>Connect Health Connect</AppButton>}
        {state.status==='update-required'&&<AppButton mode="contained" onPress={()=>void health.install()} contentStyle={{minHeight:44}}>Install or update Health Connect</AppButton>}
        {(state.status==='error'||state.status==='unavailable'||connected)&&<View style={s.actions}>
          <AppButton mode="outlined" disabled={loading} onPress={()=>void health.refresh()} contentStyle={{minHeight:44}}>Refresh steps</AppButton>
          {state.status!=='unavailable'&&<AppButton onPress={()=>void health.settings()} contentStyle={{minHeight:44}}>Step access settings</AppButton>}
        </View>}
      </View>}
      <View testID="personal-race-stage" style={s.stage}>
        {!ready?<ActivityIndicator accessibilityLabel="Loading your character"/>:<View style={StyleSheet.absoluteFill}><TrackScene appearance={appearance} race fill stepCount={steps}/></View>}
        <View pointerEvents="none" style={[s.nameplate,{backgroundColor:colors.surface,borderColor:colors.onSurface}]}><Text variant="labelLarge" style={{fontWeight:'800'}}>You{appearance.pet==='none'?'':' + your companion'}</Text></View>
      </View>
      <View style={[s.progressCard,{backgroundColor:colors.surface,borderColor:colors.outlineVariant}]}>
        <View style={s.targetHeading}><Text variant="labelLarge" style={{fontWeight:'800'}}>Your daily target</Text><Text variant="labelLarge" style={{color:colors.onSurfaceVariant}}>10,000 steps</Text></View>
        <View accessible accessibilityRole="progressbar" accessibilityLabel="Progress toward your 10,000-step target" accessibilityValue={{min:0,max:DAILY_TARGET,now:Math.min(steps??0,DAILY_TARGET),text:steps===null?'Connect Health Connect to see progress':`${steps.toLocaleString()} of 10,000 steps`}} style={s.railArea}>
          <View style={[s.rail,{backgroundColor:colors.surfaceVariant}]}><View style={{height:'100%',width:`${percent}%`,backgroundColor:colors.primaryContainer,borderRadius:8}}/></View>
          <View style={[s.startDot,{backgroundColor:colors.outlineVariant}]}/>
          {ready&&<View style={[s.avatarMarker,{left:`${percent}%`,backgroundColor:colors.secondaryContainer,borderColor:colors.primaryContainer}]}><SvgXml xml={portraitSvg(appearance)} width="100%" height="100%" accessible={false}/></View>}
          <View style={[s.flag,{backgroundColor:colors.surface}]}><Svg width="21" height="27" viewBox="0 0 21 27" accessible={false}><Path d="M3 25V2 M4 3H18L14 8L18 13H4" stroke={colors.onSurface} strokeWidth="2" fill={colors.tertiaryContainer} strokeLinejoin="round" strokeLinecap="round"/></Svg></View>
        </View>
        <Text variant="labelSmall" style={{color:colors.onSurfaceVariant}}>{steps===null?'Your character moves along this strip as steps arrive.':steps>=DAILY_TARGET?'Daily target reached. Every extra step still counts.':`${(DAILY_TARGET-steps).toLocaleString()} steps to your target`}</Text>
      </View>
      <View style={s.syncRow}>
        <Pressable accessibilityRole="button" accessibilityLabel="Show Health Connect details" accessibilityState={{expanded:details}} onPress={()=>setDetails(v=>!v)} style={s.syncDetails}>
          <View style={[s.statusDot,{backgroundColor:connected?colors.tertiary:colors.outline}]}/>
          <Text variant="labelSmall" style={{color:colors.onSurfaceVariant,flexShrink:1}}>{loading?'Reading your steps…':connected?`Health Connect · ${new Date(state.updatedAt!).toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'})}`:'Health Connect · not connected'}</Text>
        </Pressable>
        {state.status!=='unsupported'&&<Pressable accessibilityRole="button" accessibilityLabel="Refresh steps" disabled={loading} onPress={()=>void health.refresh()} style={s.refresh}>{loading?<ActivityIndicator size={20}/>:<RefreshIcon color={colors.onSurface}/>}</Pressable>}
        {(state.status==='permission-required'||state.status==='error')&&<AppButton onPress={()=>void health.settings()}>Step settings</AppButton>}
      </View>
      {!!loadError&&<Text accessibilityLiveRegion="polite" style={{color:colors.error,paddingHorizontal:20}}>{loadError}</Text>}
    </ScrollView>
  </SafeAreaView>;
}
const s=StyleSheet.create({
  screen:{flex:1},content:{flexGrow:1,width:'100%',maxWidth:600,alignSelf:'center',paddingTop:8,paddingBottom:6},
  header:{paddingHorizontal:18,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8},wordmark:{flexDirection:'row',alignItems:'center',gap:7,flexShrink:1},logo:{fontSize:24,fontWeight:'900',letterSpacing:-1},
  score:{alignItems:'center',paddingTop:12,gap:2,paddingHorizontal:20},counter:{width:'100%',maxWidth:390,height:96},
  connection:{marginHorizontal:18,marginTop:12,borderWidth:1,borderRadius:18,padding:12,gap:6},actions:{flexDirection:'row',flexWrap:'wrap',gap:4},
  stage:{flexGrow:1,flexBasis:210,minHeight:210,justifyContent:'flex-end',marginTop:4},nameplate:{position:'absolute',bottom:16,alignSelf:'center',paddingHorizontal:14,paddingVertical:5,borderRadius:10,borderWidth:1.5},
  progressCard:{marginHorizontal:16,marginTop:-2,paddingHorizontal:16,paddingTop:10,paddingBottom:9,borderWidth:1,borderBottomWidth:3,borderRadius:22,gap:5},targetHeading:{flexDirection:'row',justifyContent:'space-between',gap:8,flexWrap:'wrap'},
  railArea:{height:46,marginLeft:16,marginRight:44,justifyContent:'center'},rail:{height:8,borderRadius:8,overflow:'hidden'},startDot:{position:'absolute',left:0,width:8,height:8,borderRadius:4},avatarMarker:{position:'absolute',marginLeft:-19,width:38,height:38,borderRadius:19,borderWidth:2.5,overflow:'hidden',zIndex:1},flag:{position:'absolute',right:-42,paddingLeft:2},
  syncRow:{paddingHorizontal:18,flexDirection:'row',alignItems:'center',flexWrap:'wrap',gap:2,minHeight:44},syncDetails:{flex:1,flexDirection:'row',alignItems:'center',gap:6,minHeight:44,paddingRight:6},statusDot:{width:6,height:6,borderRadius:3},refresh:{width:44,height:44,alignItems:'center',justifyContent:'center'},
});
