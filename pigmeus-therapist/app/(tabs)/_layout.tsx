import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { View } from 'react-native';

// Colores del tema 
const COLORS = {
  primary: '#13c8ec',
  inactive: '#94a3b8',
  surface: '#ffffff',
};

export default function TabLayout() {
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
      {/* 1. AGENDA */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Agenda',
          tabBarIcon: ({ color }) => <FontAwesome5 name="calendar-alt" size={24} color={color} />,
        }}
      />

      {/* 2. PACIENTES */}
      <Tabs.Screen
        name="patients"
        options={{
          title: 'Pacientes',
          tabBarIcon: ({ color }) => <FontAwesome5 name="user-injured" size={24} color={color} />,
        }}
      />

      {/* 3. CONSULTAS (Antes Citas) */}
      <Tabs.Screen
        name="consultations" 
        options={{
          title: 'Consultas', // Nombre visible corregido
          tabBarIcon: ({ color }) => <FontAwesome5 name="notes-medical" size={24} color={color} />, 
        }}
      />
    </Tabs>
  );
}