import React,{useState} from 'react';
import {Dialog,Portal,Text} from 'react-native-paper';
import {AppButton} from './AppButton';
import {useSession} from '../lib/session';

export function SignOutButton() {
  const {logout,demo}=useSession();
  const [confirm,setConfirm]=useState(false),[busy,setBusy]=useState(false);
  async function signout() {
    if(busy)return;
    setBusy(true);
    try {await logout();} catch {/* Local credentials are cleared even when the server is unreachable. */}
    finally {setBusy(false);setConfirm(false);}
  }
  return <><AppButton mode="outlined" onPress={()=>setConfirm(true)} contentStyle={{minHeight:48}}>{demo?'Leave demo':'Sign out'}</AppButton>
    <Portal><Dialog visible={confirm} onDismiss={()=>{if(!busy)setConfirm(false);}} dismissable={!busy}>
      <Dialog.Title>{demo?'Leave the demo?':'Sign out of Stride?'}</Dialog.Title>
      <Dialog.Content><Text variant="bodyMedium">{demo?'You can explore again any time. Sample friendships will reset.':'Your account, character and friends will stay saved. Sign in again to continue your race.'}</Text></Dialog.Content>
      <Dialog.Actions><AppButton disabled={busy} onPress={()=>setConfirm(false)}>Stay signed in</AppButton><AppButton mode="contained" disabled={busy} loading={busy} onPress={()=>void signout()}>Sign out</AppButton></Dialog.Actions>
    </Dialog></Portal></>;
}
