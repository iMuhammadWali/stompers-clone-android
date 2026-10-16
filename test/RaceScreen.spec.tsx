import React from 'react';
import {jest,it,expect,beforeEach} from '@jest/globals';
import {render,fireEvent} from '@testing-library/react-native';
import {PaperProvider,MD3LightTheme} from 'react-native-paper';
import TrackScreen from '../src/app/(tabs)/track';
import type {StepState} from '../src/lib/health/service';
let mockState:StepState;
const mockConnect=jest.fn(),mockRefresh=jest.fn();
jest.mock('expo-router',()=>({router:{push:jest.fn()},useFocusEffect:jest.fn()}));
jest.mock('react-native-safe-area-context',()=>require('react-native-safe-area-context/jest/mock').default);
jest.mock('../src/lib/session',()=>({useSession:()=>({demo:true,error:'',loading:false})}));
jest.mock('../src/lib/character/appearance',()=>({useAppearance:()=>({appearance:{...require('../src/lib/character/catalog').defaultAppearance,hair:'quiff',pet:'spaceship'},ready:true,loadError:''})}));
jest.mock('../src/lib/health/useTodaySteps',()=>({useTodaySteps:()=>({state:mockState,loading:false,connect:mockConnect,refresh:mockRefresh,settings:jest.fn(),install:jest.fn()})}));
beforeEach(()=>{mockState={status:'permission-required',steps:null,updatedAt:null,day:'2026-10-16'};mockConnect.mockClear();});
const screen=()=>render(<PaperProvider settings={{icon:()=>null}} theme={MD3LightTheme}><TrackScreen/></PaperProvider>);
it('asks for explicit step access and does not claim a zero before connection',async()=>{
  const view=await screen();expect(view.getByLabelText('Steps not connected')).toBeTruthy();
  expect(view.queryByLabelText('0 steps today')).toBeNull();
  await fireEvent.press(view.getByText('Connect Health Connect'));expect(mockConnect).toHaveBeenCalledTimes(1);
});
it('shows the fetched personal total with the saved character and no competitor',async()=>{
  mockState={status:'ready',steps:6142,updatedAt:'2026-10-16T13:00:00Z',day:'2026-10-16'};
  const view=await screen();expect(view.getByLabelText('6142 steps today')).toBeTruthy();
  expect(view.getByLabelText(/with quiff hair and a spaceship/)).toBeTruthy();
  expect(view.getByText(/Only you are on this track/)).toBeTruthy();
});
it('explains empty source data and handles browser preview without a fake step total',async()=>{
  mockState={status:'ready',steps:0,updatedAt:'2026-10-16T13:00:00Z',day:'2026-10-16'};
  const view=await screen();expect(view.getByLabelText('0 steps today')).toBeTruthy();
  expect(view.getByText(/No steps received today/)).toBeTruthy();
  mockState={status:'unsupported',steps:null,updatedAt:null,day:'2026-10-16'};
  await view.rerender(<PaperProvider settings={{icon:()=>null}} theme={MD3LightTheme}><TrackScreen/></PaperProvider>);
  expect(view.getByText(/web preview cannot read your steps/)).toBeTruthy();expect(view.queryByText('Connect Health Connect')).toBeNull();
});
