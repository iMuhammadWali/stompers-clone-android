import React, {createContext,useCallback,useContext,useEffect,useMemo,useRef,useState} from 'react';
import {ApiClient,ApiError} from './client';
import {tokenStore} from './storage';
import {DemoService} from './demo';
import type {Service,User,Friend,FriendRequest,Registration} from './types';
import type {Appearance} from './character/catalog';

const configuredUrl=process.env.EXPO_PUBLIC_API_URL?.trim();
type State={user:User|null;demo:boolean;booting:boolean;restoringError:string;error:string;
  people:Friend[];pending:FriendRequest[];loading:boolean;configured:boolean;
  login:(email:string,password:string)=>Promise<void>;register:(data:Registration)=>Promise<void>;
  startDemo:()=>void;logout:()=>Promise<void>;retryRestore:()=>Promise<void>;
  reload:()=>Promise<void>;mutate:(action:(service:Service)=>Promise<unknown>)=>Promise<void>;
  service:Service|null;completeOnboarding:(username:string,appearance:Appearance)=>Promise<void>;
  saveAppearance:(appearance:Appearance)=>Promise<void>;
  updateName:(name:string)=>Promise<void>;checkHealth:()=>Promise<boolean>};
const Context=createContext<State|null>(null);
export const message=(e:unknown)=>e instanceof Error?e.message:'Something went wrong. Try again.';

export function SessionProvider({children}:{children:React.ReactNode}) {
  const [user,setUser]=useState<User|null>(null),[demo,setDemo]=useState(false);
  const [booting,setBooting]=useState(true),[restoringError,setRestoringError]=useState('');
  const [people,setPeople]=useState<Friend[]>([]),[pending,setPending]=useState<FriendRequest[]>([]);
  const [loading,setLoading]=useState(false),[error,setError]=useState('');
  const generation=useRef(0);
  const onExpired=useCallback(()=>{generation.current++;setUser(null);setPeople([]);setPending([]);},[]);
  // ApiClient only stores this callback; it never invokes it during construction.
  // eslint-disable-next-line react-hooks/refs
  const live=useMemo(()=>configuredUrl?new ApiClient(configuredUrl,tokenStore,fetch,onExpired):null,[onExpired]);
  const [service,setService]=useState<Service|null>(live);
  const restore=useCallback(async()=>{
    setBooting(true);setRestoringError('');
    const current=generation.current;
    try {if(live) {const restored=await live.restore();if(current===generation.current)setUser(restored);}}
    catch(e) {if(!(e instanceof ApiError && e.status===401)) setRestoringError(message(e));}
    finally {setBooting(false);}
  },[live]);
  // Restoration synchronizes an external credential store with the initial session.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(()=>{void restore();},[restore]);
  const reload=useCallback(async()=>{
    if(!service||!user||user.onboardingComplete===false) return;
    const current=generation.current;
    setLoading(true);setError('');
    try {
      const [friends,requests]=await Promise.all([service.friends(),service.requests()]);
      if(current===generation.current) {setPeople(friends);setPending(requests);}
    } catch(e) {if(current===generation.current) setError(message(e));}
    finally {if(current===generation.current) setLoading(false);}
  },[service,user]);
  // Fetch when the external API account changes; loading is deliberately set before I/O.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(()=>{void reload();},[reload]);
  const value:State={user,demo,booting,restoringError,error,people,pending,loading,configured:!!live,service,
    async completeOnboarding(username,appearance) {if(!service)throw new Error('Connect to the server and try again.');const current=generation.current,next=await service.completeOnboarding(username,appearance);if(current===generation.current)setUser(next);},
    async saveAppearance(appearance) {if(!service)throw new Error('Connect to the server and try again.');const current=generation.current,next=await service.saveAppearance(appearance);if(current===generation.current)setUser(next);},
    retryRestore:restore,reload,
    async login(email,password) {if(!live) throw new Error('The backend is not connected yet. Use the demo to explore.');const u=await live.login(email,password);generation.current++;setService(live);setDemo(false);setRestoringError('');setUser(u);},
    async register(data) {if(!live) throw new Error('The backend is not connected yet. Use the demo to explore.');const u=await live.register(data);generation.current++;setService(live);setDemo(false);setRestoringError('');setUser(u);},
    startDemo() {generation.current++;const d=new DemoService();setService(d);setDemo(true);setPeople([]);setPending([]);setError('');setRestoringError('');void d.restore().then(setUser);},
    async logout() {
      try {await service?.logout();}
      finally {generation.current++;setUser(null);setPeople([]);setPending([]);setError('');setLoading(false);setDemo(false);setService(live);}
    },
    async mutate(action) {if(!service) return;await action(service);await reload();},
    async updateName(name) {if(service) {const current=generation.current,next=await service.updateName(name);if(current===generation.current)setUser(next);}},
    async checkHealth() {return service?service.health():false;},
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useSession() {const value=useContext(Context);if(!value) throw new Error('SessionProvider is missing');return value;}
