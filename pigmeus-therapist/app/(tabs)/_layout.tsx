import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind'; 
import { useTheme } from '@/core/ThemeContext'; // Importamos tu nuevo hook

export default function TabLayout() {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme(); 
  const { colors } = useTheme(); // Extraemos el color de tema actual (azul, morado, etc.)
  
  const isDark = colorScheme === 'dark';

  // Sincronizamos con los tokens de tu tailwind.config.js y el ThemeContext
  const THEME = {
    primary: colors.primary,      // Reacciona al selector de color
    inactive: isDark ? '#94a3b8' : '#64748b', // text-inverse-secondary vs text-secondary
    surface: isDark ? '#1e293b' : '#ffffff',  // surface-dark vs surface-light
    border: isDark ? '#334155' : '#f1f5f9',   // border-dark vs border-light
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: THEME.primary,
        tabBarInactiveTintColor: THEME.inactive,
        
        tabBarStyle: {
          backgroundColor: THEME.surface, 
          borderTopColor: THEME.border,   
          borderTopWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
          height: 70,
          paddingBottom: 12,
          paddingTop: 12,
        },
        
        tabBarLabelStyle: {
          fontFamily: 'Manrope_500Medium', 
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('navigation.calendar'),
          tabBarIcon: ({ color }) => <MaterialIcons name="calendar-today" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="patients"
        options={{
          title: t('navigation.patients'),
          tabBarIcon: ({ color }) => <MaterialIcons name="people" size={26} color={color} />,
        }}
      />

      <Tabs.Screen
        name="consultations" 
        options={{
          title: t('navigation.consultations'),
          tabBarIcon: ({ color }) => <MaterialIcons name="assignment" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="settings" 
        options={{
          title: t('navigation.settings'),
          tabBarIcon: ({ color }) => <MaterialIcons name="settings" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}