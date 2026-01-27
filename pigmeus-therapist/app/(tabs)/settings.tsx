import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { SettingItem } from '@/components/ui/SettingItem';
import { AuthService } from '@/services/authService';
import { useTherapistProfile } from '@/features/auth/hooks/useTherapistProfile';
import { useColorScheme } from "nativewind";
import { useTheme, THEME_PALETTE } from '@/core/ThemeContext';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { profile, loading } = useTherapistProfile();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { themeColor, setThemeColor, colors } = useTheme();

  const isDark = colorScheme === "dark";

  // Cambio de idioma simple (procederemos a persistirlo en el siguiente paso si deseas)
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

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background-light dark:bg-background-dark">
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background-light dark:bg-background-dark px-8 pt-5"
      showsVerticalScrollIndicator={false}
    >

      {/* 1. CARD DE PERFIL: Información dinámica de Firestore */}
      <View className="bg-surface-light dark:bg-surface-dark p-6 rounded-3xl items-center mb-8 shadow-soft">
        <View className="relative">
          <Image
            source={{ uri: 'https://i.pinimg.com/736x/a0/f6/d8/a0f6d8722e2ca13e433591c68bc5401f.jpg' }}
            className="w-24 h-24 rounded-full bg-border-light dark:bg-border-dark"
          />
        </View>

        <Text className="text-xl font-extrabold text-text-primary dark:text-text-inverse mt-4">
          {profile?.firstName} {profile?.lastName}
        </Text>

        <TouchableOpacity className="bg-primary px-8 py-3 rounded-xl flex-row items-center active:opacity-80">
          <MaterialIcons name="edit" size={18} color="white" />
          <Text className="text-white font-bold ml-2">{t('profile.edit_profile')}</Text>
        </TouchableOpacity>
      </View>

      {/* 2. SECCIÓN: CONFIGURACIÓN GENERAL */}
      <Text className="text-xs font-bold text-text-secondary dark:text-inverse-tertiary uppercase tracking-widest mb-4 px-2">
        {t('profile.config_title')}
      </Text>

      <View className="bg-surface-light dark:bg-surface-dark px-4 rounded-3xl mb-8">
        {/* Modo Oscuro */}
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

        {/* Idioma: Cambio dinámico con i18next */}
        <SettingItem
          iconName="language"
          title={t('profile.language')}
          value={i18n.language === 'es' ? 'Español' : 'English'}
          onPress={toggleLanguage}
        />

      </View>

      {/* seleccion de tema */}
      <Text className="text-xs font-bold text-text-secondary dark:text-inverse-tertiary uppercase tracking-widest mt-2 mb-4 px-2">
        {t('profile.theme_color')}
      </Text>

      <View className="bg-surface-light dark:bg-surface-dark p-4 rounded-3xl flex-row justify-between mb-8 shadow-soft">
        {(Object.keys(THEME_PALETTE) as Array<keyof typeof THEME_PALETTE>).map((colorKey) => (
          <TouchableOpacity
            key={colorKey}
            onPress={() => setThemeColor(colorKey)}
            style={{ backgroundColor: THEME_PALETTE[colorKey].primary }}
            className={`w-11 h-11 rounded-full items-center justify-center border-4 ${themeColor === colorKey ? 'border-primary/20' : 'border-transparent'
              }`}
          >
            {themeColor === colorKey && (
              <MaterialIcons name="check" size={20} color="white" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* 4. BOTÓN: CERRAR SESIÓN */}
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
  );
}