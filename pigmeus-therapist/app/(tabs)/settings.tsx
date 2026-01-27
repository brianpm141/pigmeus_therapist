import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { SettingItem } from '@/components/ui/SettingItem';
import { AuthService } from '@/services/authService';
import { useTherapistProfile } from '@/features/auth/hooks/useTherapistProfile';
import { useColorScheme } from "nativewind";
import { useTheme, THEME_PALETTE } from '@/core/ThemeContext';
import { EditProfileForm } from '@/features/auth/components/EdithProfileForm';
import { FloatingFormContainer, StatusModal, FormPairRows } from '@/components/layout/Molecules'; // [cite: 5, 13]
import { StatCard } from '@/features/auth/components/StatCard';

// Importación del asset por defecto
const DEFAULT_AVATAR = require('@/assets/logo.png');

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { profile, loading } = useTherapistProfile();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { themeColor, setThemeColor, colors } = useTheme();

  // Estados para Modales
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [status, setStatus] = useState({
    visible: false,
    type: 'info' as 'info' | 'error',
    title: '',
    message: ''
  });

  const isDark = colorScheme === "dark";

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(nextLang);
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Error al salir:", error);
    }
  };

  const handleEditResult = (success: boolean) => {
    setIsEditModalVisible(false);

    setTimeout(() => {
      setStatus({
        visible: true,
        type: success ? 'info' : 'error',
        title: success ? t('info.successUpdateProfile') : t('info.errorUpdateProfile'),
        message: success ? t('info.successUpdateProfileMess') : t('info.errorUpdateProfileMess')
      });

      setTimeout(() => {
        setStatus(prev => ({ ...prev, visible: false }));
      }, 2000);
    }, 500);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background-light dark:bg-background-dark">
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <ScrollView
        className="flex-1 px-8 pt-5"
        showsVerticalScrollIndicator={false}
      >
        {/* Perfil */}
        <View className="bg-surface-light dark:bg-surface-dark p-6 rounded-3xl items-center mb-8 shadow-soft">
          <View className="relative">
            <Image
              source={profile?.photoURL ? { uri: profile.photoURL } : DEFAULT_AVATAR}
              className="w-24 h-24 rounded-full bg-border-light dark:bg-border-dark border-2 border-primary"
              resizeMode="cover"
            />
          </View>

          <Text className="text-xl font-extrabold text-text-primary dark:text-text-inverse mt-4 mb-4">
            {profile?.firstName} {profile?.lastName}
          </Text>

          <View>
            <FormPairRows>
              <StatCard
                label={t('auth.patients')}
                value={profile?.stats?.totalPatients || 0}
              />
              <StatCard
                label={t('auth.sessions')}
                value={profile?.stats?.totalAppointments || 0}
                subtext={t('auth.annualTotal')}
                subtextColor="text-text-secondary"
              />
            </FormPairRows>
          </View>

          <TouchableOpacity
            className="bg-primary px-8 py-3 rounded-xl flex-row items-center active:opacity-80"
            onPress={() => setIsEditModalVisible(true)}
          >
            <MaterialIcons name="edit" size={18} color="white" />
            <Text className="text-white font-bold ml-2">{t('profile.edit_profile')}</Text>
          </TouchableOpacity>
        </View>

        {/* Ajustes */}
        <Text className="text-xs font-bold text-text-secondary dark:text-inverse-tertiary uppercase tracking-widest mb-4 px-2">
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
                trackColor={{ false: "#e2e8f0", true: colors.primary }}
                thumbColor={isDark ? "#ffffff" : "#f4f3f4"}
              />
            }
          />
          <SettingItem
            iconName="language"
            title={t('profile.language')}
            value={i18n.language === 'es' ? 'Español' : 'English'}
            onPress={toggleLanguage}
          />
        </View>

        {/* Selección de tema */}
        <Text className="text-xs font-bold text-text-secondary dark:text-inverse-tertiary uppercase tracking-widest mt-2 mb-4 px-2">
          {t('profile.theme_color')}
        </Text>

        <View className="bg-surface-light dark:bg-surface-dark p-4 rounded-3xl flex-row justify-between mb-8 shadow-soft">
          {(Object.keys(THEME_PALETTE) as Array<keyof typeof THEME_PALETTE>).map((colorKey) => (
            <TouchableOpacity
              key={colorKey}
              onPress={() => setThemeColor(colorKey)}
              style={{ backgroundColor: THEME_PALETTE[colorKey].primary }}
              className={`w-11 h-11 rounded-full items-center justify-center border-4 ${themeColor === colorKey ? 'border-primary/20' : 'border-transparent'}`}
            >
              {themeColor === colorKey && (
                <MaterialIcons name="check" size={20} color="white" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* logout */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-status-danger/30 flex-row items-center justify-center p-4 rounded-2xl mb-10 border border-status-danger/10 active:bg-status-danger/20"
        >
          <MaterialIcons name="logout" size={20} color="#ef4444" />
          <Text className="text-status-danger font-bold ml-2 text-base">
            {t('common.logout')}
          </Text>
        </TouchableOpacity>

        <Text className="text-center text-text-secondary dark:text-inverse-tertiary text-xs mb-10 font-medium">
          Beta 0.0-1 (2026)
        </Text>
      </ScrollView>

      <FloatingFormContainer
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)} // [cite: 24]
        title={t('auth.editTitle')} // [cite: 24]
        iconName="person" // [cite: 24]
      >
        <EditProfileForm onResult={handleEditResult} />
      </FloatingFormContainer>

      <StatusModal
        isVisible={status.visible} // [cite: 104]
        type={status.type} // [cite: 104]
        title={status.title} // [cite: 104]
        message={status.message} // [cite: 104]
        onConfirm={() => setStatus(prev => ({ ...prev, visible: false }))} // [cite: 104]
        confirmLabel={t('actions.confirm')}
      />
    </View>
  );
}