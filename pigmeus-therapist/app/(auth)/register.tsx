import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AuthService } from '@/services/authService';
import { Input, DatePicker } from '@/components/ui/UIComponents';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

// Requerido para cerrar la ventana del navegador tras el login
WebBrowser.maybeCompleteAuthSession();

export default function RegisterScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const LOGO_IMAGE = require('@/assets/logo.png');

  // Estados de UI
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  // Estado del Formulario
  const [form, setForm] = useState({
    name: '',
    lastName: '',
    birthDate: new Date(1995, 0, 1),
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

const [request, response, promptAsync] = Google.useAuthRequest({
  androidClientId: '511097728792-07b50cvlqehtesr66kupini4vhp4iefn.apps.googleusercontent.com',
  webClientId: '511097728792-k5gujm9a01nb7ajienrmsvvec93fals0.apps.googleusercontent.com',
  redirectUri: AuthSession.makeRedirectUri({
  }),
});

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleRegister(id_token);
    } else if (response?.type === 'cancel') {
      setLoadingGoogle(false);
    }
  }, [response]);

  const handleGoogleRegister = async (idToken: string) => {
    setLoadingGoogle(true);
    try {
      await AuthService.loginWithGoogle(idToken);
      // El router.replace se maneja generalmente en el AuthProvider
    } catch (error: any) {
      setGeneralError(t('auth.errorGoogle'));
    } finally {
      setLoadingGoogle(false);
    }
  };

  // --- VALIDACIÓN Y REGISTRO MANUAL ---
  const validateForm = () => {
    const newErrors: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/;

    const requiredFields = ['name', 'lastName', 'email', 'password', 'confirmPassword'];
    requiredFields.forEach(field => {
      if (!form[field as keyof typeof form]) newErrors.push(field);
    });

    if (newErrors.length > 0) {
      setGeneralError(t('auth.errorEmptyFields'));
      setErrors(newErrors);
      return false;
    }

    if (!emailRegex.test(form.email)) {
      setErrors(['email']);
      setGeneralError(t('auth.errorInvalidEmail'));
      return false;
    }

    if (!passwordRegex.test(form.password)) {
      setErrors(['password']);
      setGeneralError(t('auth.errorPasswordComplexity')); 
      return false;
    }

    if (form.password !== form.confirmPassword) {
      setErrors(['password', 'confirmPassword']);
      setGeneralError(t('auth.errorPasswordMismatch'));
      return false;
    }

    if (!acceptedPrivacy) {
      setGeneralError(t('auth.errorPrivacyRequired'));
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await AuthService.register({
        email: form.email,
        password: form.password,
        firstName: form.name,
        lastName: form.lastName,
        birthDate: form.birthDate,
        photoURL: ''
      });
    } catch (error: any) {
      setGeneralError(error.message || t('auth.errorRegistration'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light px-6">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 20 }}>

          <View className="bg-surface-light p-8 rounded-3xl shadow-sm border border-border-light">

            {/* Header */}
            <View className="items-center mb-6">
              <Image source={LOGO_IMAGE} className="w-24 h-24" resizeMode="contain" />
              <Text className="text-text-primary text-3xl font-extrabold text-center mt-2">{t('auth.welcome')}</Text>
              <Text className="text-text-secondary text-center">{t('auth.createProfile')}</Text>
            </View>

            {generalError ? (
              <View className="bg-status-danger/10 p-3 rounded-lg mb-4 border border-status-danger/20">
                <Text className="text-status-danger text-center font-medium">{generalError}</Text>
              </View>
            ) : null}

            {/* Inputs */}
            <View className="gap-y-1">
              <Input
                label={t('auth.name')}
                placeholder={t('auth.namePlaceholder')}
                value={form.name}
                onChangeText={(val) => setForm({ ...form, name: val })}
                error={errors.includes('name') ? ' ' : undefined}
              />
              <Input
                label={t('auth.lastName')}
                placeholder={t('auth.lastNamePlaceholder')}
                value={form.lastName}
                onChangeText={(val) => setForm({ ...form, lastName: val })}
                error={errors.includes('lastName') ? ' ' : undefined}
              />

              <DatePicker
                label={t('auth.birthDate')}
                value={form.birthDate}
                onChange={(date) => setForm({ ...form, birthDate: date })}
              />

              <Input
                label={t('auth.email')}
                placeholder={t('auth.emailPlaceholder')}
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(val) => setForm({ ...form, email: val })}
                error={errors.includes('email') ? ' ' : undefined}
              />

              {/* Password con Ojo */}
              <View className="relative">
                <Input
                  label={t('auth.password')}
                  placeholder={t('auth.passwordPlaceholder')}
                  secureTextEntry={!showPassword}
                  value={form.password}
                  onChangeText={(val) => setForm({ ...form, password: val })}
                  error={errors.includes('password') ? ' ' : undefined}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 15, top: 45 }}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={22} 
                    color="#94a3b8" 
                  />
                </TouchableOpacity>
              </View>

              <Input
                label={t('auth.confirmPassword')}
                placeholder={t('auth.passwordPlaceholder')}
                secureTextEntry
                value={form.confirmPassword}
                onChangeText={(val) => setForm({ ...form, confirmPassword: val })}
                error={errors.includes('confirmPassword') ? ' ' : undefined}
              />
            </View>

            {/* Privacidad */}
            <TouchableOpacity
              onPress={() => setAcceptedPrivacy(!acceptedPrivacy)}
              className="flex-row items-center mt-4 px-1"
              activeOpacity={0.7}
            >
              <View className={`w-5 h-5 border rounded-md mr-3 items-center justify-center ${acceptedPrivacy ? 'bg-primary border-primary' : 'border-border-light bg-surface-light'}`}>
                {acceptedPrivacy && <Ionicons name="checkmark" size={14} color="white" />}
              </View>
              <Text className="text-text-secondary text-[10px] flex-1 leading-4">
                {t('auth.privacyText')} <Text className="text-primary font-bold">{t('auth.privacyPolicy')}</Text> {t('auth.termsText')}
              </Text>
            </TouchableOpacity>

            {/* Botón de Registro Manual */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={loading || loadingGoogle}
              className={`bg-primary py-4 rounded-xl mt-8 shadow-md ${(loading || loadingGoogle) ? 'opacity-70' : ''}`}
            >
              {loading ? <ActivityIndicator color="white" /> : (
                <Text className="text-white text-center font-bold text-lg">{t('auth.finishRegistration')}</Text>
              )}
            </TouchableOpacity>

            {/* --- REGISTRO CON GOOGLE --- */}
            <View className="mt-8">
              <Text className="text-text-secondary text-center mb-6 text-xs font-bold uppercase tracking-widest">
                {t('auth.orRegisterWith')}
              </Text>
              <View className="flex-row justify-center">
                <TouchableOpacity 
                  onPress={() => {
                    setLoadingGoogle(true);
                    promptAsync();
                  }}
                  disabled={loading || loadingGoogle || !request}
                  className="w-14 h-14 rounded-full border border-border-light items-center justify-center bg-white shadow-soft"
                >
                  {loadingGoogle ? (
                    <ActivityIndicator size="small" color="#DB4437" />
                  ) : (
                    <Ionicons name="logo-google" size={26} color="#DB4437" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <View className="flex-row justify-center mt-8">
              <Text className="text-text-secondary">{t('auth.haveAccount')} </Text>
              <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
                <Text className="text-primary font-bold">{t('auth.loginLink')}</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}