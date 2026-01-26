import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { SettingItem } from '@/components/ui/SettingItem';
import { AuthService } from '@/services/authService';
import { useTherapistProfile } from '@/features/auth/hooks/useTherapistProfile';
import { useColorScheme } from "nativewind"; 

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { profile, loading } = useTherapistProfile();
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const isDark = colorScheme === "dark";

  const handleLogout = async () => {
    try {
      await AuthService.logout(); 
    } catch (error) {
      console.error("Error al salir:", error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background-light dark:bg-background-dark">
        <ActivityIndicator color="#13c8ec" size="large" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background-light dark:bg-background-dark px-4 pt-4">
      
      {/* Perfil de usuario */}
      <View className="bg-surface-light dark:bg-surface-dark p-6 rounded-3xl items-center mb-8 shadow-sm">
        <View className="relative">
          <Image 
            source={{ uri: 'https://via.placeholder.com/150' }} 
            className="w-24 h-24 rounded-full bg-border-light"
          />
          <View className="absolute bottom-0 right-0 bg-primary p-1 rounded-full border-2 border-white">
            <MaterialIcons name="verified" size={16} color="white" />
          </View>
        </View>

        <Text className="text-xl font-extrabold text-text-primary dark:text-text-inverse mt-4">
          {profile?.firstName} {profile?.lastName}
        </Text>

        <TouchableOpacity className="bg-primary px-8 py-3 rounded-xl flex-row items-center">
          <MaterialIcons name="edit" size={18} color="white" />
          <Text className="text-white font-bold ml-2">{t('profile.edit_profile')}</Text>
        </TouchableOpacity>
      </View>

      {/* Ajustes */}
      <Text className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-4 px-2">
        {t('profile.config_title')}
      </Text>

      <View className="bg-surface-light dark:bg-surface-dark px-4 rounded-3xl mb-8">
        <SettingItem 
          iconName="brightness-4" 
          title={t('profile.dark_mode')} 
          rightElement={
            <Switch
              value={isDark}
              onValueChange={toggleColorScheme}
              trackColor={{ false: "#e2e8f0", true: "#13c8ec" }}
              thumbColor={isDark ? "#ffffff" : "#f4f3f4"}
            />
          }
        />
      </View>

      {/* logout */}
      <TouchableOpacity 
        onPress={handleLogout}
        className="bg-status-danger-soft flex-row items-center justify-center p-4 rounded-2xl mb-10 border border-status-danger/10"
      >
        <MaterialIcons name="logout" size={20} color="#ef4444" />
        <Text className="text-status-danger font-bold ml-2 text-base">
          {t('common.logout')}
        </Text>
      </TouchableOpacity>

      <Text className="text-center text-text-secondary text-xs mb-10">
        Versión Beta 0.0-1
      </Text>
    </ScrollView>
  );
}