import {AppInput} from '../../components/AppInput';
import {SignOutButton} from '../../components/SignOutButton';
import {AppButton as Button} from '../../components/AppButton';
import React,{useState} from 'react';
import {View} from 'react-native';
import {Text,useTheme,Divider,Snackbar} from 'react-native-paper';
import {Page,Title,PersonAvatar,Notice,styles} from '../../components/ui';
import {useSession,message} from '../../lib/session';

export default function ProfileScreen() {
  const {user,demo,updateName,checkHealth}=useSession(),theme=useTheme();
  const [name,setName]=useState(user?.displayName??''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[toast,setToast]=useState(''),[health,setHealth]=useState('');
  async function save() {
    if(!name.trim()) {setError('Enter a display name.');return;}
    setBusy(true);setError('');try {await updateName(name.trim());setName(name.trim());setToast('Display name saved.');}catch(e){setError(message(e));}finally{setBusy(false);}
  }
  return <><Page><Title title="A familiar face." subtitle="Make yourself at home."/><View style={[styles.row,{paddingVertical:12}]}><PersonAvatar name={user?.displayName??'You'} size={72}/><View style={styles.grow}><Text variant="titleLarge">{user?.displayName}</Text><Text variant="bodyLarge" style={{color:theme.colors.onSurfaceVariant}}>@{user?.username}</Text></View></View><Divider/>
    <View style={styles.form}><Text variant="titleMedium">Your profile</Text><AppInput label="Display name" accessibilityLabel="Display name" mode="outlined" value={name} onChangeText={setName} maxLength={60} disabled={busy}/><Text variant="bodyMedium" style={{color:theme.colors.onSurfaceVariant}}>Your friends see this name. Your username stays the same.</Text><Notice text={error}/><Button mode="contained" disabled={busy||name.trim()===user?.displayName} loading={busy} onPress={()=>void save()} contentStyle={styles.button}>Save changes</Button></View>
    <View style={{gap:8,marginVertical:8}}><Text variant="labelLarge">Email address</Text><Text variant="bodyLarge">{user?.email??'Not available'}</Text></View><Divider/>
    <Text variant="titleMedium">Connection</Text><Text variant="bodyMedium" style={{color:theme.colors.onSurfaceVariant}}>{demo?'You’re exploring local sample data. No backend connection is required.':'Your account is connected to the Stride API.'}</Text>
    {!demo&&<><Button mode="outlined" disabled={busy||health==='Checking…'} onPress={()=>{setHealth('Checking…');void checkHealth().then(ok=>setHealth(ok?'API and database are reachable.':'Server unavailable. Try again later.'));}} contentStyle={styles.button}>Check server connection</Button><Text accessibilityLiveRegion="polite">{health}</Text></>}
    <SignOutButton/>
    <Text variant="bodySmall" style={{color:theme.colors.onSurfaceVariant,textAlign:'center',marginTop:8}}>Stride · Version 1.2</Text>
  </Page><Snackbar visible={!!toast} onDismiss={()=>setToast('')}>{toast}</Snackbar></>;
}
