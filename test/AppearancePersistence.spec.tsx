import React from 'react';
import {Text,Pressable} from 'react-native';
import {jest,it,expect} from '@jest/globals';
import {render,fireEvent,waitFor} from '@testing-library/react-native';
import {AppearanceProvider,appearanceStore,useAppearance} from '../src/lib/character/appearance';
let mockAccount='account-a';
jest.mock('../src/lib/session',()=>({useSession:()=>({user:{id:mockAccount}})}));
function Probe() {
  const {appearance,ready,save}=useAppearance();
  return <><Text>{ready?appearance.pet:'loading'}</Text><Pressable accessibilityLabel="Choose cat" onPress={()=>void save({...appearance,pet:'cat'})}><Text>Save cat</Text></Pressable></>;
}
it('restores a saved look after remount and isolates it from other accounts',async()=>{
  const values=new Map<string,string>();
  jest.spyOn(appearanceStore,'get').mockImplementation(async key=>values.get(key)??null);
  jest.spyOn(appearanceStore,'set').mockImplementation(async(key,value)=>{values.set(key,value);});
  const first=await render(<AppearanceProvider><Probe/></AppearanceProvider>);
  await waitFor(()=>expect(first.getByText('dog')).toBeTruthy());
  await fireEvent.press(first.getByLabelText('Choose cat'));
  await waitFor(()=>expect(first.getByText('cat')).toBeTruthy());
  await first.unmount();
  const second=await render(<AppearanceProvider><Probe/></AppearanceProvider>);
  await waitFor(()=>expect(second.getByText('cat')).toBeTruthy());
  mockAccount='account-b';
  await second.rerender(<AppearanceProvider><Probe/></AppearanceProvider>);
  await waitFor(()=>expect(second.getByText('dog')).toBeTruthy());
  mockAccount='account-a';
  await second.rerender(<AppearanceProvider><Probe/></AppearanceProvider>);
  await waitFor(()=>expect(second.getByText('cat')).toBeTruthy());
});
