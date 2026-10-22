import React from 'react';
import {View} from 'react-native';
import {Text,TextInput,useTheme} from 'react-native-paper';

type Props=React.ComponentProps<typeof TextInput>;
// Keep labels above the outline so focusing never moves the label or affix.
export function AppInput({label,accessibilityLabel,style,...props}:Props) {
  const {colors}=useTheme();
  return <View style={{gap:6}}>{typeof label==='string'&&<Text variant="labelLarge" style={{color:colors.onSurface}}>{label}</Text>}<TextInput {...props} label={undefined} accessibilityLabel={accessibilityLabel??(typeof label==='string'?label:undefined)} mode="outlined" style={[{minHeight:56,backgroundColor:colors.surface},style]}/></View>;
}
