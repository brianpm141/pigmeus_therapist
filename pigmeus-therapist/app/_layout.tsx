import "../global.css"; // Estilos
import "@/core/i18n";   // Configuración de i18n
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { StatusBar } from "expo-status-bar";
import { useFonts } from 'expo-font'; // <--- NUEVO
import * as SplashScreen from 'expo-splash-screen'; // <--- NUEVO
import { useEffect } from 'react';

// Evita que el splash screen se oculte automáticamente antes de cargar fuentes
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Carga de fuentes (puedes agregar tus propias fuentes aquí)
  const [loaded, error] = useFonts({
    // 'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'), // Ejemplo futuro
    // Por ahora usamos las del sistema, pero dejamos la estructura lista
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync(); // Ocultamos el splash cuando todo está listo
    }
  }, [loaded]);

  // Si no han cargado las fuentes, no renderizamos nada (o un loader)
  if (!loaded) {
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