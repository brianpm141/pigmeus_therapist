import "../global.css"; // Estilos
import "@/core/i18n";   // Configuración de i18n
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { 
  useFonts, 
  Manrope_400Regular, 
  Manrope_500Medium, 
  Manrope_700Bold, 
  Manrope_800ExtraBold 
} from '@expo-google-fonts/manrope';

// Evita que el splash screen se oculte automáticamente antes de cargar fuentes
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  // Carga de fuentes 

  const [fontsLoaded, error] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync(); // Ocultamos el splash cuando todo está listo
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}