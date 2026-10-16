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
function AccountAppearance({account,children}:{account:string;children:React.ReactNode}) {
  const [appearance,setAppearance]=useState<Appearance>(defaultAppearance);
  const [ready,setReady]=useState(false),[loadError,setLoadError]=useState('');
  const key=appearanceKey(account);
  useEffect(()=>{
    let active=true;
    void appearanceStore.get(key).then(value=>{if(active)setAppearance(parseAppearance(value));})
      .catch(()=>{if(active)setLoadError('Saved look could not be loaded. You can choose and save a new one.');})
      .finally(()=>{if(active)setReady(true);});
    return ()=>{active=false;};
  },[key]);
  async function save(value:Appearance) {
    const checked=parseAppearance(JSON.stringify(value));
    await appearanceStore.set(key,JSON.stringify(checked));
    setAppearance(checked);setLoadError('');
  }
  return <Context.Provider value={{appearance,ready,loadError,save}}>{children}</Context.Provider>;
}
export function AppearanceProvider({children}:{children:React.ReactNode}) {
  const {user}=useSession();const account=user?.id??'guest';
  return <AccountAppearance key={account} account={account}>{children}</AccountAppearance>;
}
export function useAppearance() {const value=useContext(Context);if(!value)throw new Error('AppearanceProvider is missing');return value;}
