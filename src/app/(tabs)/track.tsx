import React,{useState,useEffect} from 'react';
import {View,ScrollView,StyleSheet,Pressable,Modal} from 'react-native';
import {Text,useTheme,ActivityIndicator} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SvgXml} from 'react-native-svg';
import {router} from 'expo-router';
import {AppButton} from '../../components/AppButton';
import {GameText,GameIcon,RoundControl} from '../../components/GameChrome';
import {TrackScene} from '../../components/character/TrackScene';
import {useAppearance} from '../../lib/character/appearance';
import {portraitSvg,petSvg} from '../../lib/character/artwork';
import {useTodaySteps} from '../../lib/health/useTodaySteps';
import {useSession} from '../../lib/session';
const TARGET=10000;
function ResetClock() {
  const [now,setNow]=useState(()=>new Date());
  useEffect(()=>{const id=setInterval(()=>setNow(new Date()),1000);return ()=>clearInterval(id);},[]);
  const end=new Date(now);end.setHours(24,0,0,0);const sec=Math.max(0,Math.floor((+end-+now)/1000));
  const label=`Resets in ${[Math.floor(sec/3600),Math.floor(sec/60)%60,sec%60].map(v=>String(v).padStart(2,'0')).join(':')}`;
  return <View accessible accessibilityLabel={label}><GameText text={label} size={17} width={225} height={24}/></View>;
}
export default function TrackScreen() {
  const {appearance,ready,loadError}=useAppearance(),{colors}=useTheme(),{user}=useSession();
  const health=useTodaySteps(),{state,loading}=health,[details,setDetails]=useState(false);
  const connected=state.status==='ready',steps=connected?state.steps!:null,percent=Math.min(100,(steps??0)/TARGET*100);
  const total=steps===null?'···':steps.toLocaleString();
  const now=new Date(),monday=new Date(now);monday.setDate(now.getDate()-((now.getDay()+6)%7));
  const week=Array.from({length:7},(_,i)=>{const date=new Date(monday);date.setDate(monday.getDate()+i);return {date,today:date.toDateString()===now.toDateString()};});
  const name=user?.displayName?.split(' ')[0]||'You';
  const message={unsupported:'Health Connect works in the Android APK. The web preview cannot read your steps.',unavailable:'Health Connect is unavailable on this device.', 'update-required':'Install or update Health Connect, then return here.','permission-required':'Allow read access to Steps. Your health app must share steps with Health Connect.',error:'Steps could not be read. Check step access, then refresh.',ready:steps===0?'No steps received today. Check that your health app is sharing Steps with Health Connect.':'Your step total from Health Connect. Only you are on this track.'}[state.status];
  return <SafeAreaView edges={['top','left','right']} style={[s.screen,{backgroundColor:colors.background}]}>
    <ScrollView testID="race-scroll" contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <RoundControl label="Open race menu" onPress={()=>setDetails(true)} orange><GameIcon name="menu" size={31}/></RoundControl>
        <View accessible accessibilityLabel="Stride" style={s.logo}><GameText text="STRIDE" size={38} width={180} height={48}/></View>
        <Pressable accessibilityRole="button" accessibilityLabel="Edit character" onPress={()=>router.push('/character')} style={[s.petControl,{backgroundColor:colors.surface}]}><SvgXml xml={appearance.pet==='none'?portraitSvg(appearance):petSvg(appearance.pet)} width={38} height={38} accessible={false}/></Pressable>
      </View>
      <View style={s.week} accessibilityLabel="This week; today is highlighted">
        {week.map(({date,today},i)=><View key={i} accessible accessibilityLabel={`${date.toLocaleDateString(undefined,{weekday:'long',month:'short',day:'numeric'})}${today?', today':''}`} style={s.day}>
          <Text style={[s.weekday,{color:colors.onSurfaceVariant}]}>{['M','T','W','T','F','S','S'][i]}</Text>
          <View style={[s.dayCircle,{backgroundColor:today?colors.secondaryContainer:colors.surfaceVariant,borderColor:today?colors.inversePrimary:'transparent'}]}>{today?<SvgXml xml={portraitSvg(appearance)} width={39} height={39} accessible={false}/>:<Text style={[s.date,{color:colors.onSurfaceVariant}]}>{date.getDate()}</Text>}</View>
        </View>)}
      </View>
      <View style={s.score}>
        <GameText text="Steps today" width={190} height={30} size={24}/>
        <View accessible accessibilityLiveRegion="polite" accessibilityLabel={connected?`${steps} steps today`:'Steps not connected'}><GameText text={total} width={300} height={104} size={Math.min(100,440/total.length)}/></View>
        <View style={s.refresh}><RoundControl label="Refresh steps" onPress={()=>void health.refresh()} disabled={loading||state.status==='unsupported'}>{loading?<ActivityIndicator size={20}/>:<GameIcon name="refresh" size={27}/>}</RoundControl></View>
        <ResetClock/>
      </View>
      {!connected&&<View testID="step-connection-panel" style={s.connection}>
        {state.status==='permission-required'?<AppButton mode="contained" onPress={()=>void health.connect()} loading={loading} disabled={loading} contentStyle={{minHeight:44}}>Connect Health Connect</AppButton>:state.status==='update-required'?<AppButton mode="contained" onPress={()=>void health.install()}>Install or update Health Connect</AppButton>:<Pressable accessibilityRole="button" onPress={()=>setDetails(true)}><Text style={{textAlign:'center',color:colors.onSurfaceVariant}}>{message}</Text></Pressable>}
      </View>}
      <View testID="personal-race-stage" style={s.stage}>
        {ready?<View style={StyleSheet.absoluteFill}><TrackScene appearance={appearance} race fill stepCount={steps}/></View>:<ActivityIndicator accessibilityLabel="Loading your character"/>}
        <View pointerEvents="none" style={s.nameAnchor}><View style={[s.nameplate,{backgroundColor:colors.surface,borderColor:colors.onSurface}]}><Text numberOfLines={1} style={{fontFamily:'LilitaOne',fontSize:14,color:colors.onSurface}}>{name}</Text></View></View>
        <View style={s.solo}><Text style={{fontFamily:'LilitaOne',fontSize:15,color:colors.onSurface}}>Solo walk</Text></View>
        <View style={[s.progress,{backgroundColor:colors.surface,borderColor:colors.outlineVariant}]}>
          <View accessible accessibilityRole="progressbar" accessibilityLabel="Progress toward your 10,000-step target" accessibilityValue={{min:0,max:TARGET,now:Math.min(steps??0,TARGET),text:steps===null?'Connect Health Connect to see progress':`${steps.toLocaleString()} of 10,000 steps`}} style={s.rail}>
            <View style={[s.dashes,{borderColor:colors.outlineVariant}]}/>
            <View style={[s.marker,{left:`${percent}%`,backgroundColor:colors.surfaceVariant,borderColor:colors.primaryContainer}]}><SvgXml xml={portraitSvg(appearance)} width="100%" height="100%" accessible={false}/></View>
            <View style={[s.finish,{backgroundColor:colors.inversePrimary,borderColor:colors.primaryContainer}]}><GameIcon name="track" size={25}/></View>
          </View>
          <Text style={[s.goal,{color:colors.onSurfaceVariant}]}>10k</Text>
        </View>
        {steps===0&&<Pressable accessibilityRole="button" accessibilityLabel="No steps received today. Open step settings" onPress={()=>setDetails(true)} style={s.noData}><Text style={{fontSize:11,color:colors.onSurfaceVariant}}>No steps received today · Step settings</Text></Pressable>}
      </View>
    </ScrollView>
    <Modal visible={details} transparent animationType="fade" onRequestClose={()=>setDetails(false)}>
      <View style={s.backdrop}><Pressable accessibilityRole="button" accessibilityLabel="Close race menu" style={StyleSheet.absoluteFill} onPress={()=>setDetails(false)}/><View accessibilityViewIsModal style={[s.sheet,{backgroundColor:colors.surface}]}>
        <Text variant="titleLarge" style={{fontFamily:'LilitaOne'}}>Your walk</Text><Text variant="bodyMedium">{message}</Text>
        {state.updatedAt&&<Text variant="bodySmall">Updated {new Date(state.updatedAt).toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'})} · Health Connect</Text>}
        <AppButton mode="contained" onPress={()=>{setDetails(false);router.push('/character');}}>Edit character</AppButton>
        {state.status!=='unsupported'&&<AppButton mode="outlined" onPress={()=>void health.settings()}>Step access settings</AppButton>}
        <Text variant="bodySmall">Read-only Steps access. Totals stay on your device. The 10k marker is your personal target.</Text>
        {!!loadError&&<Text style={{color:colors.error}}>{loadError}</Text>}
        <AppButton onPress={()=>setDetails(false)}>Close</AppButton>
      </View></View>
    </Modal>
  </SafeAreaView>;
}
const s=StyleSheet.create({screen:{flex:1},content:{flexGrow:1,width:'100%',maxWidth:600,alignSelf:'center'},header:{height:58,paddingHorizontal:16,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},logo:{position:'absolute',left:0,right:0,alignItems:'center',pointerEvents:'none'},petControl:{width:44,height:44,borderRadius:24,alignItems:'center',justifyContent:'center'},week:{paddingHorizontal:12,paddingTop:4,flexDirection:'row',height:72},day:{flex:1,alignItems:'center',gap:3},weekday:{fontFamily:'LilitaOne',fontSize:12},dayCircle:{width:42,height:42,borderRadius:23,borderWidth:3,alignItems:'center',justifyContent:'center',overflow:'hidden'},date:{fontFamily:'LilitaOne',fontSize:18},score:{alignItems:'center',paddingTop:10},refresh:{position:'absolute',right:20,top:70},connection:{marginHorizontal:28,marginTop:8},stage:{flexGrow:1,flexBasis:250,minHeight:250},nameAnchor:{position:'absolute',left:0,width:'46%',bottom:76,alignItems:'center'},nameplate:{paddingHorizontal:10,paddingVertical:4,borderRadius:6,borderWidth:1.4,maxWidth:'90%'},solo:{position:'absolute',right:20,bottom:91},progress:{position:'absolute',left:16,right:16,bottom:8,height:62,borderRadius:32,borderWidth:1,borderBottomWidth:4,paddingHorizontal:28,justifyContent:'center',elevation:4,shadowColor:'#000000',shadowOffset:{width:0,height:3},shadowOpacity:.12,shadowRadius:4},rail:{height:44,marginRight:12,justifyContent:'center'},dashes:{width:'100%',borderTopWidth:3,borderStyle:'dashed'},marker:{position:'absolute',marginLeft:-21,width:44,height:44,borderRadius:24,borderWidth:3,overflow:'hidden'},finish:{position:'absolute',right:-15,width:34,height:34,borderRadius:20,borderWidth:2,alignItems:'center',justifyContent:'center'},goal:{position:'absolute',right:18,bottom:1,fontFamily:'LilitaOne',fontSize:10},noData:{position:'absolute',top:8,alignSelf:'center',padding:8},backdrop:{flex:1,backgroundColor:'rgba(0,0,0,.32)',justifyContent:'center',padding:24},sheet:{padding:22,borderRadius:24,gap:14,width:'100%',maxWidth:420,alignSelf:'center'}});
