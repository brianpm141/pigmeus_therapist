import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTherapistProfile } from '@/features/auth/hooks/useTherapistProfile';
import { useTheme } from '@/core/ThemeContext';

// Importación del asset por defecto (Consistencia con SettingsScreen)
const DEFAULT_AVATAR = require('@/assets/logo.png');

export const MainHeader = () => {
  const { profile } = useTherapistProfile();
  const { colors } = useTheme();

  const displayName = profile 
    ? `${profile.firstName} ${profile.lastName}` 
    : 'Cargando...';

  return (
    <View className="flex-row items-center justify-between px-6 pt-14 pb-4 ">
      <View className="flex-row items-center">
        <View className="relative">
          <Image 
            source={profile?.photoURL ? { uri: profile.photoURL } : DEFAULT_AVATAR} 
            className="w-12 h-12 rounded-full border-2"
            style={{ borderColor: colors.primary }}
            resizeMode="cover"
          />
        </View>

        <View className="ml-3">
          <Text className="text-xs font-bold text-text-secondary uppercase tracking-widest">
            Terapeuta
          </Text>
          <Text className="text-lg font-extrabold text-text-primary dark:text-text-inverse leading-tight">
            {displayName}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        className="w-11 h-11 bg-surface-light dark:bg-surface-dark items-center justify-center rounded-full shadow-sm active:opacity-70"
      >
        <MaterialIcons name="notifications-none" size={24} color={colors.primary} />
        
        <View 
          className="absolute top-2.5 right-3 w-2.5 h-2.5 bg-status-danger rounded-full border-2 border-surface-light dark:border-surface-dark" 
        />
      </TouchableOpacity>
    </View>
  );
};