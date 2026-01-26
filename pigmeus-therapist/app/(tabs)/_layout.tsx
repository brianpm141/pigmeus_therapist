import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind'; 

export default function TabLayout() {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme(); 
  const isDark = colorScheme === 'dark';

  const THEME = {
    primary: '#13c8ec', 
    inactive: '#94a3b8', 
    surface: isDark ? '#192b2e' : '#ffffff', 
    border: isDark ? '#334155' : '#e2e8f0',  
    text: isDark ? '#e2e8f0' : '#0f172a',    
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
          paddingBottom: 10,
          paddingTop: 10,
        },
        
        tabBarLabelStyle: {
          fontFamily: 'Manrope_500Medium', 
          fontSize: 12,
          marginTop: 4,
          color: undefined, // Deja que el TintColor lo maneje
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