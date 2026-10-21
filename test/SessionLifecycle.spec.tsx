import React from 'react';
import {Pressable,Text,View} from 'react-native';
import {it,expect,jest,afterAll} from '@jest/globals';
import {render,fireEvent,waitFor,act} from '@testing-library/react-native';
import {defaultAppearance} from '../src/lib/character/catalog';

let mockResolve:(user:unknown)=>void;
const mockPending=new Promise(resolve=>{mockResolve=resolve;});
const mockUser={id:'one',username:'walker',displayName:'Walker',onboardingComplete:true};
jest.mock('../src/lib/client',()=>({
  ApiError:class extends Error {},
  ApiClient:class {
    async restore(){return mockUser;}
    async friends(){return [];}
    async requests(){return [];}
    async logout(){}
    saveAppearance(){return mockPending;}
  },
}));
jest.mock('../src/lib/storage',()=>({tokenStore:{}}));
const previous=process.env.EXPO_PUBLIC_API_URL;
process.env.EXPO_PUBLIC_API_URL='https://api.example/api/v1';
// Load after configuring the public endpoint, using the same React module as the renderer.
const {SessionProvider,useSession}=require('../src/lib/session');
afterAll(()=>{if(previous===undefined)delete process.env.EXPO_PUBLIC_API_URL;else process.env.EXPO_PUBLIC_API_URL=previous;});
function Probe() {
  const state=useSession();
  return <View><Text>{state.user?'Signed in':'Signed out'}</Text>
    <Pressable accessibilityRole="button" accessibilityLabel="Save character" onPress={()=>void state.saveAppearance(defaultAppearance)}><Text>Save</Text></Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel="Log out" onPress={()=>void state.logout()}><Text>Exit</Text></Pressable>
  </View>;
}
it('a late character-save response cannot restore a logged-out account',async()=>{
  const view=await render(<SessionProvider><Probe/></SessionProvider>);
  await waitFor(()=>expect(view.getByText('Signed in')).toBeTruthy());
  await fireEvent.press(view.getByLabelText('Save character'));
  await fireEvent.press(view.getByLabelText('Log out'));
  await waitFor(()=>expect(view.getByText('Signed out')).toBeTruthy());
  await act(async()=>{mockResolve({...mockUser,appearance:defaultAppearance});await mockPending;});
  expect(view.getByText('Signed out')).toBeTruthy();
});
