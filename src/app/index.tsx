import {AppInput} from '../components/AppInput';
import {AppButton as Button} from '../components/AppButton';
import React,{useState} from 'react';
import {View,KeyboardAvoidingView,Platform} from 'react-native';
import {Text,useTheme,ActivityIndicator} from 'react-native-paper';
import {Redirect} from 'expo-router';
import {Page,Mark,Notice,styles} from '../components/ui';
import {useSession,message} from '../lib/session';
import {PasswordField} from '../components/PasswordField';

export default function AuthScreen() {
  const session=useSession(),theme=useTheme();
  const [signup,setSignup]=useState(false),[email,setEmail]=useState(''),[password,setPassword]=useState('');
  const [busy,setBusy]=useState(false),[error,setError]=useState('');
  if(session.user) return <Redirect href={!session.demo&&session.user.onboardingComplete!==true?"/onboarding":"/(tabs)/track"}/>;
  async function submit() {
    setError('');
    if(!/^\S+@\S+\.\S+$/.test(email.trim())) {setError('Enter a valid email address.');return;}
    if(password.length<(signup?10:1)||password.length>128) {setError(signup?'Use a password with 10–128 characters.':'Enter your password.');return;}
    setBusy(true);
    try {if(signup) await session.register({email:email.trim(),password});else await session.login(email,password);}
    catch(e) {setError(message(e));} finally {setBusy(false);}
  }
  return <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':'height'}><Page>
    <View style={[styles.brand,{marginTop:20}]}><Mark/><Text variant="titleLarge" style={{fontWeight:'800',letterSpacing:-0.6}}>stride</Text></View>
    <View style={{gap:18,paddingVertical:22}}><Text variant="displaySmall" style={{fontWeight:'700',letterSpacing:-1.1}}>Good company.{`\n`}More movement.</Text><Text variant="bodyLarge" style={{color:theme.colors.onSurfaceVariant,lineHeight:26}}>A place for your walking people.{`\n`}Find a friend. Take it from there.</Text></View>
    <View style={[styles.actions,{marginBottom:4}]}><Button mode={signup?'text':'contained-tonal'} onPress={()=>{setSignup(false);setError('');}} disabled={busy} contentStyle={{minHeight:48}}>Sign in</Button><Button mode={signup?'contained-tonal':'text'} onPress={()=>{setSignup(true);setError('');}} disabled={busy} contentStyle={{minHeight:48}}>Create account</Button></View>
    {session.booting?<ActivityIndicator accessibilityLabel="Restoring your session"/>:<>
      {session.restoringError&&<><Notice text={session.restoringError}/><Button onPress={()=>void session.retryRestore()}>Retry connection</Button></>}
      <View style={styles.form}>
        <AppInput mode="outlined" label="Email address" accessibilityLabel="Email address" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" disabled={busy}/>
        {signup&&<Text variant="bodyMedium" style={{color:theme.colors.onSurfaceVariant}}>Next, create your character and choose a unique @username.</Text>}
        <PasswordField value={password} onChangeText={setPassword} signup={signup} disabled={busy}/>
        <Notice text={error}/>
        <Button mode="contained" loading={busy} disabled={busy||!session.configured} onPress={()=>void submit()} contentStyle={styles.button}>{signup?'Create account':'Sign in'}</Button>
      </View>
      {!session.configured&&<Text variant="bodyMedium" style={{color:theme.colors.onSurfaceVariant}}>Account access will be available when the backend is connected.</Text>}
      <Button mode="outlined" onPress={session.startDemo} disabled={busy} contentStyle={styles.button}>Explore the demo</Button>
      <Text variant="bodySmall" style={{textAlign:'center',color:theme.colors.onSurfaceVariant}}>Sample people. No account needed.</Text>
    </>}
  </Page></KeyboardAvoidingView>;
}
