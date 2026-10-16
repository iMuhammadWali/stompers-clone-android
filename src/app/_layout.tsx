import React from 'react';
import {useColorScheme} from 'react-native';
import {Stack} from 'expo-router';
import {PaperProvider,MD3LightTheme,MD3DarkTheme} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'expo-status-bar';
import {SessionProvider} from '../lib/session';
import {lightColors,darkColors} from '../lib/palette';

export default function RootLayout() {
  const dark=useColorScheme()==='dark';
  const base=dark?MD3DarkTheme:MD3LightTheme;
  const theme={...base,roundness:3,colors:{...base.colors,...(dark?darkColors:lightColors)}};
  return <SafeAreaProvider><PaperProvider theme={theme}><SessionProvider><StatusBar style={dark?'light':'dark'}/><Stack screenOptions={{headerShown:false,contentStyle:{backgroundColor:theme.colors.background},animation:'none'}}><Stack.Screen name="index"/><Stack.Screen name="(tabs)"/><Stack.Screen name="add-friend"/></Stack></SessionProvider></PaperProvider></SafeAreaProvider>;
}
