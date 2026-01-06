import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

// Colores del tema 
const COLORS = {
  primary: '#13c8ec',
  inactive: '#94a3b8',
  surface: '#ffffff',
};

export default function TabLayout() {

  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 0,
          elevation: 10,
          height: 65,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 5,
        },
      }}
    >

      {/* 2. PACIENTES */}
      <Tabs.Screen
        name="patients"
        options={{
          title: t('navigation.patients'),
          tabBarIcon: ({ color }) => <MaterialIcons name="people" size={26} color={color} />,
        }}
      />

      {/* 1. AGENDA */}
      <Tabs.Screen
        name="index"
        options={{
          title: t('navigation.calendar'),
          tabBarIcon: ({ color }) => <MaterialIcons name="calendar-today" size={24} color={color} />,
        }}
      />

      {/* 3. CONSULTAS - */}
      <Tabs.Screen
        name="consultations" 
        options={{
          title: t('navigation.consultations'),
          tabBarIcon: ({ color }) => <MaterialIcons name="assignment" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}