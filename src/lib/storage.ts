import {Platform} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import type {TokenStore} from './client';
const key='stride.refresh-token';
// Web preview intentionally keeps tokens in memory, never localStorage.
let webToken: string | null=null;
export const tokenStore: TokenStore = {
  get: ()=>Platform.OS==='web'?Promise.resolve(webToken):SecureStore.getItemAsync(key),
  set: value=>Platform.OS==='web'?(webToken=value,Promise.resolve()):SecureStore.setItemAsync(key,value),
  clear: ()=>Platform.OS==='web'?(webToken=null,Promise.resolve()):SecureStore.deleteItemAsync(key),
};
