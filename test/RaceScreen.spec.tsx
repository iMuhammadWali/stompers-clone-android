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
jest.mock('../src/lib/session',()=>({useSession:()=>({user:{displayName:'Wali'},demo:true,error:'',loading:false})}));
jest.mock('../src/lib/character/appearance',()=>({useAppearance:()=>({appearance:{...require('../src/lib/character/catalog').defaultAppearance,hair:'quiff',pet:'spaceship'},ready:true,loadError:''})}));
jest.mock('../src/lib/health/useTodaySteps',()=>({useTodaySteps:()=>({state:mockState,loading:false,connect:mockConnect,refresh:mockRefresh,settings:jest.fn(),install:jest.fn()})}));
beforeEach(()=>{mockState={status:'permission-required',steps:null,updatedAt:null,day:'2026-10-16'};mockConnect.mockClear();mockRefresh.mockClear();});
const screen=()=>render(<PaperProvider settings={{icon:()=>null}} theme={MD3LightTheme}><TrackScreen/></PaperProvider>);
it('asks for explicit step access and does not claim a zero before connection',async()=>{
  const view=await screen();expect(view.getByLabelText('Steps not connected')).toBeTruthy();
  expect(view.queryByLabelText('0 steps today')).toBeNull();
  expect(view.getByText('Connect Health Connect')).toBeTruthy();
  const order=JSON.stringify(view.toJSON());
  expect(order.indexOf('step-connection-panel')).toBeLessThan(order.indexOf('personal-race-stage'));
  await fireEvent.press(view.getByText('Connect Health Connect'));expect(mockConnect).toHaveBeenCalledTimes(1);
});
it('shows the fetched personal total with the saved character and no competitor',async()=>{
  mockState={status:'ready',steps:6142,updatedAt:'2026-10-16T13:00:00Z',day:'2026-10-16'};
  const view=await screen();expect(view.getByLabelText('6142 steps today')).toBeTruthy();
  expect(view.getByLabelText(/with quiff hair and a spaceship/)).toBeTruthy();
  expect(view.getByText('Wali')).toBeTruthy();
  expect(view.queryByTestId('step-connection-panel')).toBeNull();
  expect(view.getByRole('progressbar').props.accessibilityValue).toMatchObject({now:6142,max:10000});
  await fireEvent.press(view.getByLabelText('Open race menu'));
  expect(view.getByText(/Accepted friends appear in your daily race/)).toBeTruthy();
});
it('explains empty source data and handles browser preview without a fake step total',async()=>{
  mockState={status:'ready',steps:0,updatedAt:'2026-10-16T13:00:00Z',day:'2026-10-16'};
  const view=await screen();expect(view.getByLabelText('0 steps today')).toBeTruthy();
  expect(view.getByLabelText(/No steps received today/)).toBeTruthy();
  mockState={status:'unsupported',steps:null,updatedAt:null,day:'2026-10-16'};
  await view.rerender(<PaperProvider settings={{icon:()=>null}} theme={MD3LightTheme}><TrackScreen/></PaperProvider>);
  expect(view.getByText(/web preview cannot read your steps/)).toBeTruthy();expect(view.queryByText('Connect Health Connect')).toBeNull();
});

it('keeps an unreadable total distinct from zero and exposes recovery before the track',async()=>{
  mockState={status:'error',steps:null,updatedAt:null,day:'2026-10-16'};
  const view=await screen();expect(view.getByText(/Steps could not be read/)).toBeTruthy();
  expect(view.queryByLabelText('0 steps today')).toBeNull();
  await fireEvent.press(view.getByLabelText('Refresh steps'));expect(mockRefresh).toHaveBeenCalledTimes(1);
});
it('caps the progress marker while retaining the full step count beyond the target',async()=>{
  mockState={status:'ready',steps:12500,updatedAt:'2026-10-16T13:00:00Z',day:'2026-10-16'};
  const view=await screen();expect(view.getByLabelText('12500 steps today')).toBeTruthy();
  expect(view.getByRole('progressbar').props.accessibilityValue).toMatchObject({now:10000,text:'12,500 of 10,000 steps'});
  expect(view.getByText('10k')).toBeTruthy();
});
