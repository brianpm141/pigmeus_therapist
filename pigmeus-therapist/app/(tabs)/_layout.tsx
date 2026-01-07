import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const THEME = {
  primary: '#13c8ec',      // Tu color "primary"
  inactive: '#94a3b8',     // Tu color "text-secondary"
  surface: '#ffffff',      // Tu color "surface-light"
  border: '#e2e8f0',       // Tu color "border-light"
}

export default function TabLayout() {

  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Colores activos e inactivos
        tabBarActiveTintColor: THEME.primary,
        tabBarInactiveTintColor: THEME.inactive,
        
        // Estilo de la barra
        tabBarStyle: {
          backgroundColor: THEME.surface,
          borderTopColor: THEME.border,
          borderTopWidth: 1, // Línea sutil superior
          elevation: 0,      // Eliminamos la sombra pesada (Android)
          shadowOpacity: 0,  // Eliminamos la sombra pesada (iOS)
          height: 70,        // Altura cómoda para dedos
          paddingBottom: 10, // Espacio inferior (importante en iPhones sin home button)
          paddingTop: 10,
        },
        
        // Estilo del texto
        tabBarLabelStyle: {
          fontFamily: 'Manrope_500Medium', // Usamos la fuente cargada en RootLayout
          fontSize: 12,
          marginTop: 4,
        },
      }}
    >

      {/* AGENDA */}
      <Tabs.Screen
        name="index"
        options={{
          title: t('navigation.calendar', 'Agenda'),
          // CAMBIO: Usamos 'calendar-today' que es 100% seguro
          tabBarIcon: ({ color }) => <MaterialIcons name="calendar-today" size={24} color={color} />,
        }}
      />

      {/* PACIENTES */}
      <Tabs.Screen
        name="patients"
        options={{
          title: t('navigation.patients'),
          tabBarIcon: ({ color }) => <MaterialIcons name="people" size={26} color={color} />,
        }}
      />

      {/* CONSULTAS */}
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