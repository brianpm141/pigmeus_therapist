import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AuthService } from '@/services/authService';

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const LOGO_IMAGE = require('@/assets/logo.png')

  // Estados para el formulario y validación
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleLogin = async () => {
    setErrors([]);
    setGeneralError('');

    // 1. Validación de campos vacíos
    const currentErrors = [];
    if (!email) currentErrors.push('email');
    if (!password) currentErrors.push('password');

    if (currentErrors.length > 0) {
      setErrors(currentErrors);
      setGeneralError(t('auth.errorCredentials'));
      return;
    }

    setLoading(true);
    try {
      // 2. Llamada al servicio de autenticación
      await AuthService.login({ email, password });
      // El NavigationGuard en _layout.tsx redirigirá a (tabs) automáticamente
    } catch (error: any) {
      // Manejo de errores comunes de Firebase
      if (error.code === 'auth/invalid-credential') {
        setGeneralError(t('auth.errorInvalidCredentials'));
      } else {
        setGeneralError(t('auth.errorUnexpected'));
      }
      setErrors(['email', 'password']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light px-6 justify-center">
      <View className="bg-surface-light p-8 rounded-3xl shadow-sm border border-border-light">

        {/* Logo/Icono Central */}
        <View className="items-center">
          <Image
            source={LOGO_IMAGE}
            className="w-32 h-32"
            resizeMode="contain"
          />
        </View>

        <Text className="text-text-primary dark:text-text-inverse text-3xl font-extrabold text-center mb-2">
          {t('auth.welcome')}
        </Text>
        <Text className="text-text-secondary dark:text-text-inverse-secondary text-center mb-6">
          {t('auth.managePatients')}
        </Text>

        {/* Mensaje de Error */}
        {generalError ? (
          <View className="bg-status-danger/10 p-3 rounded-lg mb-4 border border-status-danger/20">
            <Text className="text-status-danger text-center font-medium">{generalError}</Text>
          </View>
        ) : null}

        {/* Formulario */}
        <View className="space-y-4">
          <View className="mb-4">
            <Text className="text-text-primary dark:text-text-inverse font-bold mb-2 ml-1">{t('auth.email')}</Text>
            <View className={`flex-row items-center bg-background-light border ${errors.includes('email') ? 'border-status-danger' : 'border-border-light'} rounded-xl px-4 py-3`}>
              <TextInput
                placeholder={t('auth.emailPlaceholder')}
                className="flex-1 text-text-primary dark:text-text-inverse"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              <Ionicons name="mail-outline" size={20} color="#94a3b8" />
            </View>
          </View>

          <View>
            <Text className="text-text-primary dark:text-text-inverse font-bold mb-2 ml-1">{t('auth.password')}</Text>
            <View className={`flex-row items-center bg-background-light border ${errors.includes('password') ? 'border-status-danger' : 'border-border-light'} rounded-xl px-4 py-3`}>
              <TextInput
                placeholder={t('auth.passwordPlaceholder')}
                className="flex-1 text-text-primary dark:text-text-inverse"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />
            </View>
          </View>
        </View>

        <TouchableOpacity className="mt-4 items-end">
          <Text className="text-primary font-medium">{t('auth.forgotPassword')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className={`bg-primary py-4 rounded-xl mt-8 shadow-md ${loading ? 'opacity-70' : ''}`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-bold text-lg">{t('auth.login')}</Text>
          )}
        </TouchableOpacity>

        {/* Social Login (Círculos) */}
        <View className="mt-8">
          <Text className="text-text-secondary dark:text-text-inverse-secondary text-center mb-6 text-xs font-bold">{t('auth.orLoginWith')}</Text>
          <View className="flex-row justify-center space-x-6">
            <TouchableOpacity className="w-12 h-12 rounded-full border border-border-light items-center justify-center bg-white shadow-sm">
              <Ionicons name="logo-google" size={20} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity className="w-12 h-12 rounded-full border border-border-light items-center justify-center bg-white shadow-sm">
              <Ionicons name="logo-facebook" size={20} color="#4267B2" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row justify-center mt-8">
          <Text className="text-text-secondary dark:text-text-inverse-secondary">{t('auth.noAccount')} </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text className="text-primary font-bold">{t('auth.register')}</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}