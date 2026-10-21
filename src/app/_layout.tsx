import React from 'react';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import {PaperProvider,MD3LightTheme} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'expo-status-bar';
import {SessionProvider,useSession} from '../lib/session';
import {AppearanceProvider} from '../lib/character/appearance';
import {lightColors} from '../lib/palette';

export default function RootLayout() {
  const [fontsLoaded,fontError]=useFonts({LilitaOne:require('../../assets/fonts/LilitaOne-Regular.ttf')});
  if(!fontsLoaded&&!fontError)return null;
  const theme={...MD3LightTheme,roundness:3,colors:{...MD3LightTheme.colors,...lightColors}};
  return <SafeAreaProvider><PaperProvider theme={theme}><SessionProvider><AppearanceProvider><StatusBar style="dark"/><RootNavigator/></AppearanceProvider></SessionProvider></PaperProvider></SafeAreaProvider>;
}

function RootNavigator() {
  const {user,booting,demo}=useSession();
  const ready=!!user&&(demo||user.onboardingComplete===true);
  if(booting)return null;
  return <Stack screenOptions={{headerShown:false,animation:'none'}}>
    <Stack.Screen name="index"/>
    <Stack.Protected guard={!!user&&!ready}><Stack.Screen name="onboarding"/></Stack.Protected>
    <Stack.Protected guard={ready}><Stack.Screen name="(tabs)"/><Stack.Screen name="add-friend"/><Stack.Screen name="character"/></Stack.Protected>
  </Stack>;
}
