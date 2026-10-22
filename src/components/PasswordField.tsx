import {AppInput} from './AppInput';
import React, {useState} from 'react';
import {TextInput, useTheme} from 'react-native-paper';
import Svg, {Path, Circle} from 'react-native-svg';

export function VisibilityIcon({visible,color,size=24}:{visible:boolean;color:string;size?:number}) {
  return <Svg testID="password-visibility-icon" width={size} height={size} viewBox="0 0 24 24" accessible={false}>
    <Path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Circle cx={12} cy={12} r={3} fill="none" stroke={color} strokeWidth={2}/>
    {visible&&<Path d="M3 3 21 21" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"/>}
  </Svg>;
}

export function PasswordField({value,onChangeText,signup=false,disabled=false}:{value:string;onChangeText:(text:string)=>void;signup?:boolean;disabled?:boolean}) {
  const [visible,setVisible]=useState(false),theme=useTheme();
  return <AppInput mode="outlined" label="Password" accessibilityLabel="Password" value={value}
    onChangeText={onChangeText} secureTextEntry={!visible} autoCapitalize="none" autoCorrect={false}
    autoComplete={signup?'new-password':'current-password'} maxLength={128} disabled={disabled}
    right={<TextInput.Icon
      icon={({size})=><VisibilityIcon visible={visible} size={size} color={theme.colors.onSurface}/>}
      color={theme.colors.onSurface} onPress={()=>setVisible(current=>!current)}
      accessibilityLabel={visible?'Hide password':'Show password'} accessibilityHint="Toggle password visibility"
      style={{width:48,height:48}} forceTextInputFocus={false}/>} />;
}
