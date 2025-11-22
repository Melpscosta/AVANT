import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

// Importamos os Contextos
import { LoadingProvider } from '../LoadingContext';
import { TrilhaProvider } from '../src/context/TrilhaContext';
import { UserProvider } from '../src/context/UserContext'; // <--- 1. IMPORTANTE: Importe isso

// Impede o splash screen de sumir antes das fontes carregarem
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
   "Lexend-Light": require("../assets/fonts/Lexend-Light.ttf"),
    "Lexend-Regular": require("../assets/fonts/Lexend-Regular.ttf"),
    "LexendZetta-Regular": require("../assets/fonts/LexendZetta-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    // A ordem dos Providers importa:
    <LoadingProvider>
      <UserProvider>   {/* <--- 2. IMPORTANTE: Adicione o UserProvider aqui */}
        <TrilhaProvider>

          <StatusBar style="light" />

          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="selection" />
            <Stack.Screen name="trilha" />
            <Stack.Screen name="aula" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="about" />
          </Stack>

        </TrilhaProvider>
      </UserProvider> {/* <--- Feche o UserProvider */}
    </LoadingProvider>
  );
}