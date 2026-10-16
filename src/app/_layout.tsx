import React from 'react';
import {useColorScheme} from 'react-native';
import {Stack} from 'expo-router';
import {PaperProvider,MD3LightTheme,MD3DarkTheme} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'expo-status-bar';
import {SessionProvider} from '../lib/session';

export default function RootLayout() {
  const dark=useColorScheme()==='dark';
  const base=dark?MD3DarkTheme:MD3LightTheme;
  const theme={...base,roundness:3,colors:{...base.colors,...(dark?{
    primary:'#FFB599',onPrimary:'#411500',primaryContainer:'#60301C',onPrimaryContainer:'#FFDBCC',
    background:'#1B1917',surface:'#1B1917',surfaceVariant:'#3A332E',onSurface:'#F3EDE6',onSurfaceVariant:'#D6C5B7',
    secondaryContainer:'#3D4030',onSecondaryContainer:'#E2E6C8',outline:'#A79789',
  }:{primary:'#A63D19',onPrimary:'#FFFFFF',primaryContainer:'#FFDBCC',onPrimaryContainer:'#3C1000',
    background:'#FAF7F0',surface:'#FAF7F0',surfaceVariant:'#F0E8DD',onSurface:'#252820',onSurfaceVariant:'#625C51',
    secondaryContainer:'#E6E9D8',onSecondaryContainer:'#3A4326',outline:'#81796D',
  })}};
  return <SafeAreaProvider><PaperProvider theme={theme}><SessionProvider><StatusBar style={dark?'light':'dark'}/><Stack screenOptions={{headerShown:false,contentStyle:{backgroundColor:theme.colors.background},animation:'none'}}><Stack.Screen name="index"/><Stack.Screen name="(tabs)"/><Stack.Screen name="add-friend"/></Stack></SessionProvider></PaperProvider></SafeAreaProvider>;
}
