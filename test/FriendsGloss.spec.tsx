import React from 'react';
import {jest,it,expect} from '@jest/globals';
import {render,fireEvent} from '@testing-library/react-native';
import {PaperProvider,MD3LightTheme} from 'react-native-paper';
import {router} from 'expo-router';
import FriendsScreen from '../src/app/(tabs)/friends';
import {lightColors} from '../src/lib/palette';

jest.mock('expo-router',()=>({router:{navigate:jest.fn(),push:jest.fn()}}));
jest.mock('react-native-safe-area-context',()=>require('react-native-safe-area-context/jest/mock').default);
jest.mock('../src/lib/session',()=>({useSession:()=>({
  user:{id:'me'},people:[{id:'friend',displayName:'Maya Chen',username:'maya_moves'}],
  pending:[{recipientId:'me'},{recipientId:'me'}],loading:false,demo:true,
  reload:jest.fn(),mutate:jest.fn(),
}),message:String}));

it('shows gloss on the visible friend-request button and keeps its navigation working',async()=>{
  const view=await render(<PaperProvider theme={{...MD3LightTheme,colors:{...MD3LightTheme.colors,...lightColors}}}><FriendsScreen/></PaperProvider>);
  expect(view.getByText('2 friend requests waiting')).toBeTruthy();
  expect(view.getByTestId('incoming-requests-gloss').props.pointerEvents).toBe('none');
  await fireEvent.press(view.getByTestId('incoming-requests'));
  expect(router.navigate).toHaveBeenCalledWith('/(tabs)/requests');
});
