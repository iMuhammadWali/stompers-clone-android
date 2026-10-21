import React,{createContext,useContext,useEffect,useState} from 'react';
import {Platform} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import {useSession} from '../session';
import {appearanceKey,defaultAppearance,parseAppearance,type Appearance} from './catalog';

export const appearanceStore={
  async get(key:string) {return Platform.OS==='web'?window.localStorage.getItem(key):SecureStore.getItemAsync(key);},
  async set(key:string,value:string) {if(Platform.OS==='web')window.localStorage.setItem(key,value);else await SecureStore.setItemAsync(key,value);},
};
type State={appearance:Appearance;ready:boolean;loadError:string;save:(value:Appearance)=>Promise<void>};
const Context=createContext<State|null>(null);
function AccountAppearance({account,remote,saveRemote,children}:{account:string;remote?:Appearance|null;saveRemote?:(value:Appearance)=>Promise<void>;children:React.ReactNode}) {
  const [appearance,setAppearance]=useState<Appearance>(defaultAppearance);
  const [ready,setReady]=useState(false),[loadError,setLoadError]=useState('');
  const key=appearanceKey(account);
  useEffect(()=>{
    let active=true;
    void appearanceStore.get(key).then(value=>{if(active)setAppearance(parseAppearance(remote?JSON.stringify(remote):value));})
      .catch(()=>{if(active){if(remote)setAppearance(parseAppearance(JSON.stringify(remote)));else setLoadError('Saved look could not be loaded. You can choose and save a new one.');}})
      .finally(()=>{if(active)setReady(true);});
    return ()=>{active=false;};
  },[key,remote]);
  async function save(value:Appearance) {
    const checked=parseAppearance(JSON.stringify(value));
    if(saveRemote)await saveRemote(checked);
    try {await appearanceStore.set(key,JSON.stringify(checked));} catch(e) {if(!saveRemote)throw e;}
    setAppearance(checked);setLoadError('');
  }
  return <Context.Provider value={{appearance,ready,loadError,save}}>{children}</Context.Provider>;
}
export function AppearanceProvider({children}:{children:React.ReactNode}) {
  const {user,demo,saveAppearance}=useSession();const account=user?.id??'guest';
  return <AccountAppearance key={account} account={account} remote={user?.appearance} saveRemote={!demo&&user?.onboardingComplete?saveAppearance:undefined}>{children}</AccountAppearance>;
}
export function useAppearance() {const value=useContext(Context);if(!value)throw new Error('AppearanceProvider is missing');return value;}
