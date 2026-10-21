import React from 'react';
import {it,expect,jest} from '@jest/globals';
import {render} from '@testing-library/react-native';
import {PaperProvider,MD3LightTheme} from 'react-native-paper';
import {FriendsRace} from '../src/components/character/FriendsRace';
import {defaultAppearance} from '../src/lib/character/catalog';
jest.mock('expo-router',()=>({router:{push:jest.fn()}}));
it('shows real competitors, their characters and unknown totals without inventing a score',async()=>{
  const race={day:'2026-10-21',timeZone:'Asia/Karachi',resetsAt:'2026-10-21T19:00:00Z',data:[
    {id:'friend',username:'bobby',displayName:'Bobby',appearance:{...defaultAppearance,pet:'fox' as const},steps:5400,source:'phone-counter' as const,lastSyncedAt:new Date().toISOString()},
    {id:'me',username:'wali',displayName:'Wali',appearance:defaultAppearance,steps:null,source:null,lastSyncedAt:null},
  ]};
  const view=await render(<PaperProvider theme={MD3LightTheme}><FriendsRace race={race} selfId="me"/></PaperProvider>);
  expect(view.getByText('Bobby')).toBeTruthy();expect(view.getByText('Wali · You')).toBeTruthy();
  expect(view.getByLabelText('bobby: 5400 steps')).toBeTruthy();expect(view.getByLabelText('wali: steps not synced')).toBeTruthy();
  expect(view.getByLabelText('Bobby and companion on the daily race track')).toBeTruthy();
  expect(view.getByText('Not synced today')).toBeTruthy();
});
