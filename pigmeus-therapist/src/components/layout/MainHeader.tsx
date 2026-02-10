import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next'; 
import { useTherapistProfile } from '@/features/auth/hooks/useTherapistProfile';
import { useTheme } from '@/core/ThemeContext';

const DEFAULT_AVATAR = require('@/assets/logo.png');

export const MainHeader = () => {
  const { t, i18n } = useTranslation();
  const { profile } = useTherapistProfile();
  const { colors } = useTheme();

  const getCurrentDate = () => {
    const date = new Date();
    const locale = i18n.language || 'es-MX';

    const formatter = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const parts = formatter.formatToParts(date);
    
    const dateString = parts.map(({ type, value }) => {
      if (type === 'month') {
        return value.charAt(0).toUpperCase() + value.slice(1);
      }
      return value;
    }).join('');

    return dateString;
  };

  const displayName = profile 
    ? `${profile.firstName} ${profile.lastName}` 
    : t('common.loading');

  const dateLabel = getCurrentDate();

  return (
    <View className="flex-row items-center justify-between px-6 pt-14 pb-4 bg-background-light dark:bg-background-dark">
      <View className="flex-row items-center">
        <View className="relative">
          <Image 
            source={profile?.photoURL ? { uri: profile.photoURL } : DEFAULT_AVATAR} 
            className="w-12 h-12 rounded-full border-2"
            style={{ borderColor: colors.primary }}
            resizeMode="cover"
          />
          <View className="absolute bottom-0 right-0 w-3 h-3 bg-status-success rounded-full border-2 border-white dark:border-surface-dark" />
        </View>

        <View className="ml-3">
          <Text className="text-xs font-bold text-text-secondary uppercase tracking-widest">
            {dateLabel}
          </Text>
          
          <Text 
            numberOfLines={1} 
            className="text-lg font-extrabold text-text-primary dark:text-text-inverse leading-tight max-w-[220px]"
          >
            {displayName}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        className="w-11 h-11 bg-surface-light dark:bg-surface-dark items-center justify-center rounded-full shadow-sm active:opacity-70 border border-gray-100 dark:border-gray-800"
      >
        <MaterialIcons name="notifications-none" size={24} color={colors.primary} />
        <View 
          className="absolute top-2.5 right-3 w-2.5 h-2.5 bg-status-danger rounded-full border-2 border-surface-light dark:border-surface-dark" 
        />
      </TouchableOpacity>
    </View>
  );
};