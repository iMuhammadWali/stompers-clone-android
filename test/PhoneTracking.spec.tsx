import {beforeEach,expect,it,jest} from '@jest/globals';
import {renderHook,act,waitFor} from '@testing-library/react-native';
import type {PhoneSnapshot} from '../src/lib/health/phone';
import {useTodaySteps} from '../src/lib/health/useTodaySteps';
let mockPhone:PhoneSnapshot;
let mockPermission=true;
let mockSnapshotError=false;
let mockCaps={counter:true,detector:false,estimate:true};
const mockRead=jest.fn(async()=>({status:'ready',steps:9999,day:'2026-10-18',updatedAt:'2026-10-18T10:00:00Z'}));
const mockStart=jest.fn(async(estimate:boolean)=>{mockPhone={...mockPhone,source:'phone',running:true,mode:estimate?'estimate':'counter'};return mockPhone;});
const mockStop=jest.fn(async()=>{mockPhone={...mockPhone,running:false};return mockPhone;});
jest.mock('expo-router',()=>({useFocusEffect:(fn:()=>void)=>require('react').useEffect(fn,[fn])}));
jest.mock('../src/lib/health/platform',()=>({getHealthBridge:async()=>null}));
jest.mock('../src/lib/health/service',()=>({...jest.requireActual<any>('../src/lib/health/service'),readTodaySteps:(...args:unknown[])=>mockRead(...args as [])}));
jest.mock('../src/lib/health/phone',()=>({getPhoneBridge:()=>({snapshot:async()=>{if(mockSnapshotError)throw new Error('storage failed');return mockPhone;},capabilities:async()=>mockCaps,start:mockStart,stop:mockStop,useHealth:async()=>{mockPhone={...mockPhone,source:'health',running:false};}}),requestActivityPermission:async()=>mockPermission}));
beforeEach(()=>{mockPhone={source:'phone',mode:'counter',running:true,enabled:true,steps:123,day:'2026-10-18',gap:true,unallocated:0,error:null};mockPermission=true;mockSnapshotError=false;mockCaps={counter:true,detector:false,estimate:true};mockStart.mockClear();mockStop.mockClear();mockRead.mockClear();});
it('uses the selected phone total without adding or reading Health Connect',async()=>{
 const {result}=await renderHook(()=>useTodaySteps());await waitFor(()=>expect(result.current.state.steps).toBe(123));expect(mockRead).not.toHaveBeenCalled();
});
it('stopping shows a paused state, and switching sources replaces rather than adds totals',async()=>{
 const {result}=await renderHook(()=>useTodaySteps());await waitFor(()=>expect(result.current.state.steps).toBe(123));
 await act(async()=>{await result.current.stopPhone();});expect(result.current.state.steps).toBe(123);expect(result.current.phone?.running).toBe(false);
 await act(async()=>{await result.current.useHealth();});expect(result.current.state.steps).toBe(9999);expect(result.current.phone?.source).toBe('health');
});
it('denied physical activity permission never starts the service',async()=>{
 mockPermission=false;const {result}=await renderHook(()=>useTodaySteps());await act(async()=>{await result.current.startPhone();});expect(mockStart).not.toHaveBeenCalled();expect(result.current.phoneError).toMatch(/Physical activity/);
});
it('requires a separate explicit opt-in for accelerometer estimation',async()=>{
 mockCaps={counter:false,detector:false,estimate:true};mockPhone={...mockPhone,running:false,source:'health'};
 const {result}=await renderHook(()=>useTodaySteps());await act(async()=>{await result.current.startPhone();});expect(mockStart).not.toHaveBeenCalled();expect(result.current.canEstimate).toBe(true);
 await act(async()=>{await result.current.startPhone(true);});expect(mockStart).toHaveBeenCalledWith(true);expect(result.current.phone?.mode).toBe('estimate');
});

it('a failed native snapshot does not silently read a different source or invent zero',async()=>{
 mockSnapshotError=true;const {result}=await renderHook(()=>useTodaySteps());await waitFor(()=>expect(result.current.state.status).toBe('error'));expect(result.current.state.steps).toBeNull();expect(mockRead).not.toHaveBeenCalled();
});

it('serializes repeated Start taps into one native start',async()=>{
 mockPhone={...mockPhone,running:false};const {result}=await renderHook(()=>useTodaySteps());await act(async()=>{await Promise.all([result.current.startPhone(),result.current.startPhone()]);});expect(mockStart).toHaveBeenCalledTimes(1);expect(result.current.loading).toBe(false);
});
