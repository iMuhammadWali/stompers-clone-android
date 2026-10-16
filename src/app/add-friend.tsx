import React,{useState} from 'react';
import {View,KeyboardAvoidingView,Platform} from 'react-native';
import {Text,TextInput,Button,useTheme} from 'react-native-paper';
import {router,Redirect} from 'expo-router';
import {Page,Title,Notice,styles} from '../components/ui';
import {useSession,message} from '../lib/session';

export default function AddFriendScreen() {
  const {user,demo,mutate}=useSession(),theme=useTheme();
  const [username,setUsername]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[sent,setSent]=useState(false);
  if(!user)return <Redirect href="/"/>;
  async function send() {
    setError('');
    if(!/^[a-zA-Z0-9_]{3,30}$/.test(username.trim())) {setError('Enter an exact username: 3–30 letters, numbers, or underscores.');return;}
    setBusy(true);try {await mutate(s=>s.sendRequest(username));setSent(true);}catch(e){setError(message(e));}finally{setBusy(false);}
  }
  return <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':'height'}><Page><View style={{alignItems:'flex-start'}}><Button icon="arrow-left" onPress={()=>router.canGoBack()?router.back():router.replace('/(tabs)/friends')} contentStyle={{minHeight:48}}>Back</Button></View>
    <Title title={sent?'Invitation sent.':'Bring a friend.'} subtitle={sent?`Your request to @${username.trim().toLowerCase()} is waiting for a reply.`:'Know their username? That’s all you need.'}/>
    {sent?<><Text variant="bodyLarge" style={{color:theme.colors.onSurfaceVariant,lineHeight:26}}>Once they accept, you’ll appear in each other’s friends list.</Text><Button mode="contained" buttonColor={theme.colors.primaryContainer} textColor={theme.colors.onPrimaryContainer} onPress={()=>router.replace('/(tabs)/requests')} contentStyle={styles.button}>View requests</Button><Button mode="text" onPress={()=>{setSent(false);setUsername('');}}>Add another friend</Button></>:
      <View style={styles.form}><TextInput label="Their username" accessibilityLabel="Their username" mode="outlined" value={username} onChangeText={setUsername} autoCapitalize="none" autoCorrect={false} maxLength={30} disabled={busy} left={<TextInput.Affix text="@"/>} onSubmitEditing={()=>{if(!busy)void send();}} returnKeyType="send"/><Text variant="bodyMedium" style={{color:theme.colors.onSurfaceVariant}}>Use their exact username, without the @ symbol.</Text>{demo&&<Text variant="bodySmall" style={{color:theme.colors.onSurfaceVariant}}>In this demo, try trail_friend. No real invitation will be sent.</Text>}<Notice text={error}/><Button mode="contained" buttonColor={theme.colors.primaryContainer} textColor={theme.colors.onPrimaryContainer} icon="account-plus-outline" loading={busy} disabled={busy||!username.trim()} onPress={()=>void send()} contentStyle={styles.button}>Send friend request</Button></View>}
  </Page></KeyboardAvoidingView>;
}
