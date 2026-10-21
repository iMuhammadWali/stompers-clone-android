import React,{useState} from 'react';
import {View,KeyboardAvoidingView,Platform} from 'react-native';
import {Text,TextInput,useTheme} from 'react-native-paper';
import {router,Redirect} from 'expo-router';
import {SvgXml} from 'react-native-svg';
import {AppButton} from '../components/AppButton';
import {Page,Title,Notice,PersonAvatar,styles} from '../components/ui';
import {portraitSvg} from '../lib/character/artwork';
import {parseAppearance} from '../lib/character/catalog';
import {useSession,message} from '../lib/session';
import type {PlayerLookup} from '../lib/types';

export default function AddFriendScreen() {
  const {user,demo,service,mutate}=useSession(),theme=useTheme();
  const [username,setUsername]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
  const [found,setFound]=useState<PlayerLookup|null>(null),[sent,setSent]=useState(false);
  if(!user)return <Redirect href="/"/>;
  async function search() {
    if(busy||!service)return;
    setError('');setFound(null);setSent(false);
    const name=username.trim().replace(/^@/,'').toLowerCase();
    if(!/^[a-z0-9_]{3,30}$/.test(name)){setError('Enter their exact username: 3–30 letters, numbers or underscores.');return;}
    setBusy(true);
    try {setFound(await service.lookupPlayer(name));}
    catch(e) {setError(message(e));}finally{setBusy(false);}
  }
  async function send() {
    if(!found||busy)return;
    setBusy(true);setError('');
    try {await mutate(s=>s.sendRequest(found.user.username));setFound({...found,relationship:'outgoing'});setSent(true);}
    catch(e) {setError(message(e));}finally{setBusy(false);}
  }
  const relationship=sent?'Request sent. They’ll join your daily race after accepting.':found?{
    self:'This is you. Share your @username with a friend.',
    friends:'You’re already friends and in each other’s daily race.',
    incoming:'They’ve already invited you. Open Requests to accept.',
    outgoing:'Your request is waiting for their reply.',
    none:'Is this your friend? Send a request to join each other’s daily race.',
  }[found.relationship]:'';
  return <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':'height'}><Page>
    <AppButton icon="arrow-left" onPress={()=>router.canGoBack()?router.back():router.replace('/(tabs)/friends')} style={{alignSelf:'flex-start'}} contentStyle={{minHeight:48}}>Back</AppButton>
    <Title title="Find your friend." subtitle="Search their exact @username to check you’ve found the right person."/>
    <View style={styles.form}>
      <TextInput label="Their username" accessibilityLabel="Their username" mode="outlined" value={username} onChangeText={value=>{setUsername(value);setFound(null);setSent(false);setError('');}} autoCapitalize="none" autoCorrect={false} maxLength={31} disabled={busy} left={<TextInput.Affix text="@"/>} onSubmitEditing={()=>void search()} returnKeyType="search"/>
      {demo&&<Text variant="bodySmall">Sample lookup: trail_friend. No real invitation is sent.</Text>}
      <AppButton mode="contained" loading={busy&&!found} disabled={busy||!username.trim()} onPress={()=>void search()} contentStyle={styles.button}>Find player</AppButton>
      <Notice text={error}/>
    </View>
    {found&&<View style={{gap:16,borderTopWidth:1,borderColor:theme.colors.outlineVariant,paddingTop:20}}>
      <View style={styles.row}>
        {found.user.appearance?<SvgXml xml={portraitSvg(parseAppearance(JSON.stringify(found.user.appearance)))} width={64} height={64} accessible={false}/>:<PersonAvatar name={found.user.displayName} size={64}/>}
        <View style={styles.grow}><Text variant="titleLarge">{found.user.displayName}</Text><Text variant="bodyLarge" style={{color:theme.colors.onSurfaceVariant}}>@{found.user.username}</Text></View>
      </View>
      <Text accessibilityLiveRegion="polite" variant="bodyMedium">{relationship}</Text>
      {found.relationship==='none'&&<AppButton mode="contained" disabled={busy} loading={busy} onPress={()=>void send()} contentStyle={styles.button}>Send friend request</AppButton>}
      {(found.relationship==='incoming'||found.relationship==='outgoing')&&<AppButton mode="outlined" onPress={()=>router.replace('/(tabs)/requests')} contentStyle={styles.button}>View requests</AppButton>}
    </View>}
    <Text variant="bodySmall" style={{color:theme.colors.onSurfaceVariant}}>Only accepted friends share race progress. You can remove a friend at any time.</Text>
  </Page></KeyboardAvoidingView>;
}
