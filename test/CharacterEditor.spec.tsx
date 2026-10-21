import React from 'react';
import {jest,it,expect,beforeEach} from '@jest/globals';
import {render,fireEvent} from '@testing-library/react-native';
import {PaperProvider,MD3LightTheme} from 'react-native-paper';
import {router} from 'expo-router';
import type {TestInstance} from 'test-renderer';
import CharacterScreen from '../src/app/character';
import {defaultAppearance,type Appearance} from '../src/lib/character/catalog';
import {lightColors} from '../src/lib/palette';
const mockSave=jest.fn<(value:Appearance)=>Promise<void>>();
jest.mock('expo-router',()=>({router:{replace:jest.fn(),back:jest.fn(),canGoBack:()=>true}}));
jest.mock('react-native-safe-area-context',()=>require('react-native-safe-area-context/jest/mock').default);
jest.mock('../src/lib/session',()=>({useSession:()=>({demo:true,error:'',loading:false})}));
jest.mock('../src/lib/character/appearance',()=>({useAppearance:()=>({appearance:require('../src/lib/character/catalog').defaultAppearance,ready:true,save:mockSave})}));
beforeEach(()=>{mockSave.mockReset();jest.mocked(router.replace).mockClear();});
const screen=()=>render(<PaperProvider settings={{icon:()=>null}} theme={{...MD3LightTheme,colors:{...MD3LightTheme.colors,...lightColors}}}><CharacterScreen/></PaperProvider>);
it('updates the track preview immediately, then saves the selected look',async()=>{
  mockSave.mockResolvedValue(undefined);
  const view=await screen();
  await fireEvent.press(view.getByLabelText('Curls'));
  await fireEvent.press(view.getByText('Pet'));
  await fireEvent.press(view.getByLabelText('Mochi · Cat'));
  expect(view.getByLabelText(/Your character wearing lagoon tee, with curls hair and a cat/)).toBeTruthy();
  await fireEvent.press(view.getByText('Save look'));
  expect(mockSave).toHaveBeenCalledWith({...defaultAppearance,hair:'curls',pet:'cat'});
  expect(router.replace).toHaveBeenCalledWith('/(tabs)/track');
});
it('keeps the edited look and shows an error if device storage fails',async()=>{
  mockSave.mockRejectedValue(new Error('disk unavailable'));
  const view=await screen();
  await fireEvent.press(view.getByText('Pet'));
  await fireEvent.press(view.getByLabelText('Just me'));
  await fireEvent.press(view.getByText('Save look'));
  expect(view.getByText('Your look could not be saved. Check your connection and try again.')).toBeTruthy();
  expect(router.replace).not.toHaveBeenCalled();
  expect(view.getByLabelText('Just me').props.accessibilityState.selected).toBe(true);
});
it('leaving the editor discards unsaved selections',async()=>{
  const view=await screen();
  await fireEvent.press(view.getByLabelText('Female'));
  await fireEvent.press(view.getByLabelText('Ponytail'));
  await fireEvent.press(view.getByText('Back'));
  expect(router.back).toHaveBeenCalled();
  expect(mockSave).not.toHaveBeenCalled();
});

it('combines gender, eye, nose, expression, and shirt choices without replacing existing hair or pet choices',async()=>{
  mockSave.mockResolvedValue(undefined);
  const view=await screen();
  await fireEvent.press(view.getByLabelText('Female'));
  await fireEvent.press(view.getByText('Face'));
  await fireEvent.press(view.getByLabelText('Almond'));
  await fireEvent.press(view.getByLabelText('Soft bridge'));
  await fireEvent.press(view.getByLabelText('Grin'));
  await fireEvent.press(view.getByText('Clothes'));
  await fireEvent.press(view.getByLabelText('Hoodie'));
  await fireEvent.press(view.getByLabelText('Lilac'));
  await fireEvent.press(view.getByText('Save look'));
  expect(mockSave).toHaveBeenCalledWith({...defaultAppearance,gender:'female',hair:'longwaves',eyes:'almond',nose:'wedge',expression:'grin',shirt:'hoodie',outfit:'lilac'});
});

it('filters gender-specific inventory and replaces incompatible selections on gender change',async()=>{
  mockSave.mockResolvedValue(undefined);
  const view=await screen();
  expect(view.getByLabelText('Crop')).toBeTruthy();
  expect(view.queryByLabelText('Ponytail')).toBeNull();
  await fireEvent.press(view.getByLabelText('Male'));
  expect(view.getByLabelText('Crop')).toBeTruthy();
  expect(view.queryByLabelText('Ponytail')).toBeNull();
  await fireEvent.press(view.getByLabelText('Crop'));
  await fireEvent.press(view.getByText('Clothes'));
  expect(view.getByLabelText('Raglan')).toBeTruthy();
  expect(view.queryByLabelText('Striped')).toBeNull();
  await fireEvent.press(view.getByLabelText('Raglan'));
  await fireEvent.press(view.getByText('Look'));
  await fireEvent.press(view.getByLabelText('Female'));
  expect(view.queryByLabelText('Crop')).toBeNull();
  expect(view.getByLabelText('Ponytail').props.accessibilityState.selected).toBe(true);
  expect(view.getByLabelText('Ponytail')).toBeTruthy();
  await fireEvent.press(view.getByText('Clothes'));
  expect(view.queryByLabelText('Raglan')).toBeNull();
  expect(view.getByLabelText('Striped')).toBeTruthy();
  expect(view.getByLabelText('Classic tee').props.accessibilityState.selected).toBe(true);
  await fireEvent.press(view.getByText('Save look'));
  expect(mockSave).toHaveBeenCalledWith({...defaultAppearance,gender:'female',hair:'ponytail',shirt:'tee'});
});

it('uses artwork-only choice tiles while retaining accessible names and selected state',async()=>{
  const view=await screen();
  await fireEvent.press(view.getByText('Face'));
  expect(view.queryByText('Determined')).toBeNull();
  expect(view.queryByText('Round')).toBeNull();
  expect(view.queryByText('Button nose')).toBeNull();
  await fireEvent.press(view.getByLabelText('Determined'));
  expect(view.getByLabelText('Determined').props.accessibilityState.checked).toBe(true);
});

it('offers exactly two visibly labeled genders and keeps their representative portraits distinct',async()=>{
  const view=await screen();
  expect(view.getByText('Male')).toBeTruthy();expect(view.getByText('Female')).toBeTruthy();
  expect(view.queryByLabelText('Nonbinary')).toBeNull();
  await fireEvent.press(view.getByLabelText('Female'));
  expect(view.getByLabelText('Female').props.accessibilityState.checked).toBe(true);
});
it('shows unsaved state and restores the saved appearance with one reset action',async()=>{
  const view=await screen();expect(view.getByText('Saved look')).toBeTruthy();
  await fireEvent.press(view.getByLabelText('Curls'));
  expect(view.getByText('Unsaved changes')).toBeTruthy();
  await fireEvent.press(view.getByText('Reset changes'));
  expect(view.getByText('Saved look')).toBeTruthy();
  expect(view.getByLabelText('Waves').props.accessibilityState.checked).toBe(true);
  expect(mockSave).not.toHaveBeenCalled();
});

it('keeps catalog images fixed while changes update the character draft',async()=>{
  mockSave.mockResolvedValue(undefined);
  const view=await screen();
  const hairBefore=(view.getByLabelText('Curls').children[0] as TestInstance).toJSON();
  const genderBefore=(view.getByLabelText('Female').children[0] as TestInstance).toJSON();
  await fireEvent.press(view.getByLabelText('Honey'));
  await fireEvent.press(view.getByLabelText('Deep'));
  await fireEvent.press(view.getByLabelText('Curls'));
  expect((view.getByLabelText('Curls').children[0] as TestInstance).toJSON()).toEqual(hairBefore);
  expect((view.getByLabelText('Female').children[0] as TestInstance).toJSON()).toEqual(genderBefore);
  await fireEvent.press(view.getByText('Face'));
  const noseBefore=(view.getByLabelText('Button nose').children[0] as TestInstance).toJSON();
  const eyeBefore=(view.getByLabelText('Round').children[0] as TestInstance).toJSON();
  await fireEvent.press(view.getByLabelText('Grin'));
  await fireEvent.press(view.getByLabelText('Soft bridge'));
  expect((view.getByLabelText('Button nose').children[0] as TestInstance).toJSON()).toEqual(noseBefore);
  expect((view.getByLabelText('Round').children[0] as TestInstance).toJSON()).toEqual(eyeBefore);
  await fireEvent.press(view.getByText('Save look'));
  expect(mockSave).toHaveBeenCalledWith({...defaultAppearance,hairColor:'honey',skin:'deep',hair:'curls',expression:'grin',nose:'wedge'});
});

it('keeps the preview and category controls outside the scrollable options',async()=>{
  const view=await screen();
  const fixed=view.getByTestId('fixed-page-header'),preview=view.getByTestId('character-preview');
  function hasAncestor(node:TestInstance,target:TestInstance):boolean {
    for(let parent=node.parent;parent;parent=parent.parent)if(parent===target)return true;
    return false;
  }
  expect(hasAncestor(preview,fixed)).toBe(true);
  for(const category of ['Look','Face','Clothes','Pet'])expect(hasAncestor(view.getByLabelText(category),fixed)).toBe(true);
  expect(hasAncestor(view.getByLabelText('Curls'),fixed)).toBe(false);
  await fireEvent.press(view.getByLabelText('Quiff'));
  expect(view.getByLabelText(/Your character wearing lagoon tee, with quiff hair/)).toBeTruthy();
  await fireEvent.press(view.getByText('Face'));
  expect(view.getByLabelText('Round')).toBeTruthy();
  expect(hasAncestor(view.getByLabelText('Face'),fixed)).toBe(true);
  expect(view.getByLabelText(/with quiff hair/)).toBeTruthy();
});
it('offers separate hairstyle catalogs and saves sunglasses and an alien spaceship together',async()=>{
  mockSave.mockResolvedValue(undefined);const view=await screen();
  expect(view.getByLabelText('Spikes')).toBeTruthy();expect(view.queryByLabelText('Braids')).toBeNull();
  await fireEvent.press(view.getByLabelText('Female'));
  expect(view.queryByLabelText('Spikes')).toBeNull();expect(view.queryByLabelText('Curls')).toBeNull();
  await fireEvent.press(view.getByLabelText('Braids'));
  await fireEvent.press(view.getByText('Face'));await fireEvent.press(view.getByLabelText('Sunglasses'));
  expect(view.getByLabelText(/wearing sunglasses/)).toBeTruthy();
  await fireEvent.press(view.getByText('Pet'));await fireEvent.press(view.getByLabelText('Orbit · Alien spaceship'));
  expect(view.getByLabelText(/and a spaceship/)).toBeTruthy();
  await fireEvent.press(view.getByText('Save look'));
  expect(mockSave).toHaveBeenCalledWith({...defaultAppearance,gender:'female',hair:'braids',eyewear:'sunglasses',pet:'spaceship'});
});
