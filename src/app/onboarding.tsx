import React,{useEffect,useState} from 'react';
import {KeyboardAvoidingView,Platform,View} from 'react-native';
import {Redirect} from 'expo-router';
import {Text,TextInput,useTheme,ActivityIndicator} from 'react-native-paper';
import {CharacterEditor} from './character';
import {Page,Title,Notice,styles} from '../components/ui';
import {AppButton} from '../components/AppButton';
import {SignOutButton} from '../components/SignOutButton';
import {useAppearance} from '../lib/character/appearance';
import {useSession,message} from '../lib/session';
import type {Appearance} from '../lib/character/catalog';
import type {HandleAvailability} from '../lib/types';

export default function OnboardingScreen() {
  const {user,service,completeOnboarding}=useSession(),{ready}=useAppearance(),theme=useTheme();
  const [editing,setEditing]=useState(true);
  const [look,setLook]=useState<Appearance|null>(null),[username,setUsername]=useState(user?.username??'');
  const [availability,setAvailability]=useState<HandleAvailability|null>(null),[checking,setChecking]=useState(false);
  const [busy,setBusy]=useState(false),[error,setError]=useState(''),[lookupError,setLookupError]=useState(''),[retry,setRetry]=useState(0);
  const valid=/^[a-z0-9_]{3,30}$/.test(username);
  useEffect(()=>{
    if(!look||!service||!valid)return;
    let active=true;
    const timer=setTimeout(()=>{
      setChecking(true);setLookupError('');
      void service.usernameAvailability(username).then(value=>{if(active)setAvailability(value);})
        .catch(e=>{if(active)setLookupError(message(e));}).finally(()=>{if(active)setChecking(false);});
    },400);
    return ()=>{active=false;clearTimeout(timer);};
  },[username,look,service,valid,retry]);
  if(!user)return <Redirect href="/"/>;
  if(user.onboardingComplete)return <Redirect href="/(tabs)/track"/>;
  if(!ready)return <Page><ActivityIndicator accessibilityLabel="Loading character setup"/></Page>;
  if(editing||!look)return <CharacterEditor initialAppearance={look??undefined} onSave={async value=>{setLook(value);setEditing(false);}}/>;
  const result=availability?.username===username?availability:null;
  async function finish() {
    if(!look||busy)return;
    setBusy(true);setError('');
    try {await completeOnboarding(username,look);}
    catch(e) {setError(message(e));setAvailability(null);setRetry(n=>n+1);}
    finally {setBusy(false);}
  }
  return <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':'height'}><Page>
    <AppButton disabled={busy} onPress={()=>setEditing(true)} style={{alignSelf:'flex-start'}} contentStyle={{minHeight:48}}>Back to character</AppButton>
    <Title title="Choose your @username." subtitle="This is your player ID. Friends use it to find you."/>
    <View style={styles.form}>
      <TextInput mode="outlined" label="Username" accessibilityLabel="Username" value={username} onChangeText={value=>{setUsername(value.replace(/^@/,'').toLowerCase());setAvailability(null);setError('');setLookupError('');setChecking(false);}} autoCapitalize="none" autoCorrect={false} maxLength={30} disabled={busy} left={<TextInput.Affix text="@"/>}/>
      <Text variant="bodyMedium" style={{color:theme.colors.onSurfaceVariant}}>Use 3–30 letters, numbers or underscores. Your username is unique and stays with your account.</Text>
      <View accessibilityLiveRegion="polite">
        {checking?<Text>Checking availability…</Text>:result?<Text style={{color:result.available?theme.colors.onSurface:theme.colors.error}}>{result.available?`@${username} is available.`:'That username is taken. Try another.'}</Text>:username&&!valid?<Text style={{color:theme.colors.error}}>Use 3–30 letters, numbers or underscores.</Text>:null}
      </View>
      {!!result?.suggestions.length&&<View style={[styles.actions,{flexWrap:'wrap'}]}>{result.suggestions.map(name=><AppButton key={name} mode="outlined" disabled={busy} onPress={()=>{setUsername(name);setAvailability(null);}}>@{name}</AppButton>)}</View>}
      <Notice text={lookupError||error}/>
      {!!lookupError&&<AppButton onPress={()=>setRetry(n=>n+1)}>Check again</AppButton>}
      <Text variant="bodyMedium" style={{color:theme.colors.onSurfaceVariant}}>Accepted friends see your character and today’s steps in your daily race. Your email stays private. The race resets at midnight Pakistan time.</Text>
      <AppButton mode="contained" loading={busy} disabled={busy||checking||!result?.available} onPress={()=>void finish()} contentStyle={styles.button}>Save and enter Stride</AppButton>
    </View>
    <SignOutButton/>
  </Page></KeyboardAvoidingView>;
}
