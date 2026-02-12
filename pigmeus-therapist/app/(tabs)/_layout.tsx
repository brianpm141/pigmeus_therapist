import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind'; 
import { useTheme } from '@/core/ThemeContext'; 
import { MainHeader } from '@/components/layout/MainHeader';

export default function TabLayout() {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme(); 
  const { colors } = useTheme(); 
  
  const isDark = colorScheme === 'dark';

  const THEME = {
    primary: colors.primary,      
    inactive: isDark ? '#94a3b8' : '#64748b', 
    surface: isDark ? colors.bgDark : colors.bg, 
    border: colors.soft,  
  };

  return (
  <View className='flex-1 bg-background-light dark:bg-background-dark'>
    
    <MainHeader />

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
          height: 85,
          paddingBottom: 25,
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

  </View>

    
  );
}