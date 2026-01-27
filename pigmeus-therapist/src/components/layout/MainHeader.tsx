import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTherapistProfile } from '@/features/auth/hooks/useTherapistProfile';
import { useTheme } from '@/core/ThemeContext';

export const MainHeader = () => {
  const { profile } = useTherapistProfile();
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center justify-between px-6 pt-14 pb-4">
      <View className="flex-row items-center">
        {/* perfil*/}
        <View className="relative">
          <Image 
            source={{ uri: 'https://i.pinimg.com/736x/81/01/a4/8101a432ae9f1f92cb7aa0d87cec54de.jpg' }} 
            className="w-12 h-12 rounded-full border-2"
            style={{ borderColor: colors.primary }}
          />
        </View>

        {/* Nombre */}
        <View className="ml-3">
          <Text className="text-lg font-extrabold text-text-primary dark:text-text-inverse leading-tight">
            { (profile?.firstName + " " + profile?.lastName) || 'Cargando...'}
          </Text>
        </View>
      </View>

      {/* Campanita de Notificaciones (Referencia: image_ab2b1a.png) */}
      <TouchableOpacity 
        className="w-11 h-11 bg-surface-light dark:bg-surface-dark items-center justify-center rounded-full shadow-sm"
      >
        <MaterialIcons name="notifications-none" size={24} color={colors.primary} />
        {/* Punto rojo de notificación activa */}
        <View className="absolute top-2.5 right-3 w-2.5 h-2.5 bg-status-danger rounded-full border-2 border-surface-light dark:border-surface-dark" />
      </TouchableOpacity>
    </View>
  );
};