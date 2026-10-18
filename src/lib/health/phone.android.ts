import {requireNativeModule} from 'expo';
import {PermissionsAndroid,Platform} from 'react-native';
import type {PhoneBridge} from './phone';
export function getPhoneBridge():PhoneBridge|null {
  try{return requireNativeModule<PhoneBridge>('StrideSteps');}catch{return null;}
}
export async function requestActivityPermission(){
  if(Number(Platform.Version)>=29){
    const result=await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION);
    if(result!==PermissionsAndroid.RESULTS.GRANTED)return false;
  }
  if(Number(Platform.Version)>=33)await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  return true;
}
