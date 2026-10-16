import React from 'react';
import {describe,it,expect} from '@jest/globals';
import {render,fireEvent} from '@testing-library/react-native';
import {PaperProvider} from 'react-native-paper';
import {PasswordField} from '../src/components/PasswordField';

describe('Password visibility',()=>{
  it('renders the vector eye and toggles masking both ways without changing the value',async()=>{
    const view=await render(<PaperProvider><PasswordField value="secret-password" onChangeText={()=>{}}/></PaperProvider>);
    expect(view.getByLabelText('Password').props.secureTextEntry).toBe(true);
    expect(view.getByTestId('password-visibility-icon')).toBeTruthy();
    await fireEvent.press(view.getByLabelText('Show password'));
    expect(view.getByLabelText('Password').props.secureTextEntry).toBe(false);
    expect(view.getByLabelText('Password').props.value).toBe('secret-password');
    await fireEvent.press(view.getByLabelText('Hide password'));
    expect(view.getByLabelText('Password').props.secureTextEntry).toBe(true);
  });
  it('uses the same visibility control for account creation',async()=>{
    const view=await render(<PaperProvider><PasswordField value="new-password" onChangeText={()=>{}} signup/></PaperProvider>);
    expect(view.getByLabelText('Password').props.autoComplete).toBe('new-password');
    await fireEvent.press(view.getByLabelText('Show password'));
    expect(view.getByLabelText('Password').props.secureTextEntry).toBe(false);
  });
});
