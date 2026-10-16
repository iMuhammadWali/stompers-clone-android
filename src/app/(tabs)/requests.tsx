import React,{useState} from 'react';
import {View} from 'react-native';
import {Text,Button,Divider,useTheme,Snackbar} from 'react-native-paper';
import {Page,Title,PersonAvatar,Empty,Notice,styles} from '../../components/ui';
import {useSession,message} from '../../lib/session';

export default function RequestsScreen() {
  const {pending,user,mutate,loading}=useSession(),theme=useTheme();
  const [busy,setBusy]=useState(''),[error,setError]=useState(''),[toast,setToast]=useState('');
  const incoming=pending.filter(r=>r.recipientId===user?.id),outgoing=pending.filter(r=>r.senderId===user?.id);
  async function act(id:string,action:'accept'|'decline'|'cancel') {
    setBusy(id);setError('');
    try {await mutate(s=>action==='cancel'?s.cancel(id):s.respond(id,action));setToast(action==='accept'?'Friend added.':action==='decline'?'Request declined.':'Request cancelled.');}
    catch(e) {setError(message(e));} finally {setBusy('');}
  }
  return <><Page refresh><Title title="An open invitation." subtitle="Good company is a two-way thing."/><Notice text={error}/>
    <Text variant="titleMedium" style={styles.section}>Received{incoming.length?` · ${incoming.length}`:''}</Text>
    {!incoming.length?<Empty title={loading?'Checking your invitations…':'You’re all caught up'} body="New friend requests will appear here."/>:
      <View>{incoming.map(r=><View key={r.id}><View style={[styles.row,{alignItems:'flex-start'}]}><PersonAvatar name={r.senderUsername}/><View style={styles.grow}><Text variant="titleMedium">@{r.senderUsername}</Text><Text variant="bodyMedium" style={{color:theme.colors.onSurfaceVariant}}>Wants to add you as a friend</Text><View style={[styles.actions,{marginTop:12}]}><Button mode="contained" disabled={!!busy} loading={busy===r.id} onPress={()=>void act(r.id,'accept')} contentStyle={{minHeight:48}}>Accept</Button><Button mode="outlined" disabled={!!busy} onPress={()=>void act(r.id,'decline')} contentStyle={{minHeight:48}}>Decline</Button></View></View></View><Divider/></View>)}</View>}
    <Text variant="titleMedium" style={styles.section}>Sent{outgoing.length?` · ${outgoing.length}`:''}</Text>
    {!outgoing.length?<Text variant="bodyLarge" style={{color:theme.colors.onSurfaceVariant}}>No requests waiting for a reply.</Text>:
      <View>{outgoing.map(r=><View key={r.id}><View style={[styles.row,{flexWrap:'wrap'}]}><PersonAvatar name={r.recipientUsername}/><View style={styles.grow}><Text variant="titleMedium">@{r.recipientUsername}</Text><Text variant="bodyMedium" style={{color:theme.colors.onSurfaceVariant}}>Waiting for a reply</Text></View><Button disabled={!!busy} loading={busy===r.id} onPress={()=>void act(r.id,'cancel')} contentStyle={{minHeight:48}}>Cancel</Button></View><Divider/></View>)}</View>}
  </Page><Snackbar visible={!!toast} onDismiss={()=>setToast('')}>{toast}</Snackbar></>;
}
