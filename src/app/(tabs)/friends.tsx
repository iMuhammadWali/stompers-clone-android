import React,{useState} from 'react';
import {View} from 'react-native';
import {Text,Button,Divider,Dialog,Portal,useTheme,Searchbar,Snackbar} from 'react-native-paper';
import {router} from 'expo-router';
import {Page,Title,PersonAvatar,Mark,Empty,Notice,styles} from '../../components/ui';
import {useSession,message} from '../../lib/session';
import type {Friend} from '../../lib/types';

export default function FriendsScreen() {
  const {people,mutate,loading,pending,user}=useSession(),theme=useTheme();
  const [query,setQuery]=useState(''),[selected,setSelected]=useState<Friend|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[toast,setToast]=useState('');
  const visible=people.filter(p=>`${p.displayName} ${p.username}`.toLowerCase().includes(query.toLowerCase()));
  const incoming=pending.filter(r=>r.recipientId===user?.id).length;
  async function remove() {
    if(!selected) return;
    setBusy(true);setError('');
    try {await mutate(s=>s.remove(selected.id));setSelected(null);setToast('Friend removed.');} catch(e) {setError(message(e));} finally {setBusy(false);}
  }
  return <><Page refresh>
    <View style={[styles.brand,{justifyContent:'space-between'}]}><View style={styles.brand}><Mark size={28}/><Text variant="titleMedium" style={{fontWeight:'800'}}>stride</Text></View><Button icon="account-plus-outline" mode="text" onPress={()=>router.push('/add-friend')} contentStyle={{minHeight:48}}>Add friend</Button></View>
    <Title title="Your people." subtitle="A little company goes a long way."/>
    {incoming>0&&<Button mode="contained-tonal" icon="email-outline" onPress={()=>router.navigate('/(tabs)/requests')} contentStyle={{minHeight:56}}>{incoming} friend request{incoming===1?'':'s'} waiting</Button>}
    <View style={{gap:8,marginTop:6}}><Text variant="titleMedium">Friends{people.length?` · ${people.length}`:''}</Text><Searchbar placeholder="Find a friend in your list" value={query} onChangeText={setQuery} style={{backgroundColor:theme.colors.surfaceVariant}}/></View>
    {loading&&!people.length?<View style={{gap:16,paddingTop:12}}>{[0,1,2].map(i=><View key={i} style={[styles.row,{opacity:0.55}]}><View style={{height:52,width:52,borderRadius:26,backgroundColor:theme.colors.surfaceVariant}}/><View style={{height:24,width:'60%',backgroundColor:theme.colors.surfaceVariant,borderRadius:6}}/></View>)}</View>:
      !visible.length?<Empty title={query?'No matching friends':'Your circle starts here'} body={query?'Try a different name or username.':'Add someone by their username. Once they accept, they will appear here.'} action={!query?<Button mode="contained" icon="account-plus-outline" onPress={()=>router.push('/add-friend')} contentStyle={styles.button}>Add your first friend</Button>:undefined}/>:
      <View>{visible.map(person=><View key={person.id}><View style={styles.row}><PersonAvatar name={person.displayName}/><View style={styles.grow}><Text variant="titleMedium">{person.displayName}</Text><Text variant="bodyMedium" style={{color:theme.colors.onSurfaceVariant}}>@{person.username}</Text></View><Button mode="text" accessibilityLabel={`Manage friendship with ${person.displayName}`} onPress={()=>{setSelected(person);setError('');}} contentStyle={{minHeight:48}}>Manage</Button></View><Divider/></View>)}</View>}
    <Text variant="bodySmall" style={{color:theme.colors.onSurfaceVariant,marginTop:12}}>Pull down to refresh your friends and requests.</Text>
  </Page><Portal><Dialog visible={!!selected} onDismiss={()=>{if(!busy)setSelected(null);}}><Dialog.Title>Remove {selected?.displayName}?</Dialog.Title><Dialog.Content><Text variant="bodyMedium">You will both be removed from each other’s friends list. You can send another request later.</Text><Notice text={error}/></Dialog.Content><Dialog.Actions><Button disabled={busy} onPress={()=>setSelected(null)}>Keep friend</Button><Button loading={busy} disabled={busy} onPress={()=>void remove()}>Remove friend</Button></Dialog.Actions></Dialog></Portal><Snackbar visible={!!toast} onDismiss={()=>setToast('')}>{toast}</Snackbar></>;
}
