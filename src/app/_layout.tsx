import React from 'react';
import {Stack} from 'expo-router';
import {PaperProvider,MD3LightTheme} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'expo-status-bar';
import {SessionProvider} from '../lib/session';
import {AppearanceProvider} from '../lib/character/appearance';
import {lightColors} from '../lib/palette';

export default function RootLayout() {
  const theme={...MD3LightTheme,roundness:3,colors:{...MD3LightTheme.colors,...lightColors}};
  return <SafeAreaProvider><PaperProvider theme={theme}><SessionProvider><AppearanceProvider><StatusBar style="dark"/><Stack screenOptions={{headerShown:false,contentStyle:{backgroundColor:theme.colors.background},animation:'none'}}><Stack.Screen name="index"/><Stack.Screen name="(tabs)"/><Stack.Screen name="add-friend"/><Stack.Screen name="character"/></Stack></AppearanceProvider></SessionProvider></PaperProvider></SafeAreaProvider>;
}
