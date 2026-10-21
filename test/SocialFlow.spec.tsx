import React from 'react';
import {jest,it,expect,beforeEach} from '@jest/globals';
import {render,fireEvent,waitFor} from '@testing-library/react-native';
import {PaperProvider,MD3LightTheme} from 'react-native-paper';
import {SignOutButton} from '../src/components/SignOutButton';
import AddFriendScreen from '../src/app/add-friend';
import OnboardingScreen from '../src/app/onboarding';
import {defaultAppearance,type Appearance} from '../src/lib/character/catalog';

const mockLogout=jest.fn(async()=>{}),mockComplete=jest.fn(async(_username:string,_appearance:Appearance)=>{}),mockSend=jest.fn(async(_username:string)=>{});
const mockAvailability=jest.fn(async(username:string)=>({username,available:username!=='taken',suggestions:username==='taken'?['taken_1']:[]}));
const mockLookup=jest.fn(async(_username:string)=>({user:{id:'friend',username:'bobby',displayName:'Bobby',appearance:defaultAppearance},relationship:'none'}));
let mockUser:any;
jest.mock('expo-router',()=>({Redirect:()=>null,router:{canGoBack:()=>false,replace:jest.fn(),push:jest.fn()}}));
jest.mock('react-native-safe-area-context',()=>require('react-native-safe-area-context/jest/mock').default);
jest.mock('../src/lib/session',()=>({message:(e:Error)=>e.message,useSession:()=>({user:mockUser,demo:false,error:'',loading:false,logout:mockLogout,completeOnboarding:mockComplete,service:{usernameAvailability:mockAvailability,lookupPlayer:mockLookup},mutate:(action:any)=>action({sendRequest:mockSend})})}));
jest.mock('../src/lib/character/appearance',()=>({useAppearance:()=>({ready:true})}));
jest.mock('../src/app/character',()=>({CharacterEditor:({onSave}:any)=>{
  const React=require('react'),{Pressable,Text}=require('react-native');
  return React.createElement(Pressable,{onPress:()=>onSave(require('../src/lib/character/catalog').defaultAppearance),accessibilityRole:'button'},React.createElement(Text,null,'Continue to username'));
}}));
const screen=(child:React.ReactNode)=>render(<PaperProvider settings={{icon:()=>null}} theme={MD3LightTheme}>{child}</PaperProvider>);
beforeEach(()=>{mockUser={id:'me',username:'',displayName:'Walker',onboardingComplete:false};jest.clearAllMocks();});

it('requires a character before username setup and checks taken names with suggestions',async()=>{
  const view=await screen(<OnboardingScreen/>);
  expect(view.queryByLabelText('Username')).toBeNull();expect(mockComplete).not.toHaveBeenCalled();
  await fireEvent.press(view.getByText('Continue to username'));
  await fireEvent.changeText(view.getByLabelText('Username'),'taken');
  await waitFor(()=>expect(view.getByText('That username is taken. Try another.')).toBeTruthy());
  await fireEvent.press(view.getByText('@taken_1'));
  await waitFor(()=>expect(view.getByText('@taken_1 is available.')).toBeTruthy());
  await fireEvent.press(view.getByText('Save and enter Stride'));
  expect(mockComplete).toHaveBeenCalledWith('taken_1',defaultAppearance);
});

it('previews a found player before sending an invitation and then exposes request status',async()=>{
  mockUser.onboardingComplete=true;
  const view=await screen(<AddFriendScreen/>);
  expect(view.queryByText('Send friend request')).toBeNull();
  await fireEvent.changeText(view.getByLabelText('Their username'),'@BOBBY');
  await fireEvent.press(view.getByText('Find player'));
  await waitFor(()=>expect(view.getByText('Bobby')).toBeTruthy());
  expect(mockLookup).toHaveBeenCalledWith('bobby');expect(mockSend).not.toHaveBeenCalled();
  await fireEvent.press(view.getByText('Send friend request'));
  await waitFor(()=>expect(view.getByText(/Request sent/)).toBeTruthy());
  expect(mockSend).toHaveBeenCalledWith('bobby');expect(view.queryByText('Send friend request')).toBeNull();
});

it('sign-out cancellation preserves the session; only confirmation logs out',async()=>{
  const view=await screen(<SignOutButton/>);
  await fireEvent.press(view.getByText('Sign out'));
  await waitFor(()=>expect(view.getByText('Sign out of Stride?')).toBeTruthy());
  expect(mockLogout).not.toHaveBeenCalled();
  await fireEvent.press(view.getByText('Stay signed in'));
  expect(mockLogout).not.toHaveBeenCalled();
  await fireEvent.press(view.getAllByText('Sign out')[0]);
  await waitFor(()=>expect(view.getByText('Sign out of Stride?')).toBeTruthy());
  await fireEvent.press(view.getAllByText('Sign out').at(-1)!);
  await waitFor(()=>expect(mockLogout).toHaveBeenCalledTimes(1));
});
