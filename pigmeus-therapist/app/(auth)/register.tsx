import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AuthService } from '@/services/authService';

export default function RegisterScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const LOGO_IMAGE = require('@/assets/logo.png');

  // 1. Estado del formulario incluyendo birthDate
  const [form, setForm] = useState({
    name: '',
    lastName: '',
    birthDate: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleRegister = async () => {
    setErrors([]);
    setGeneralError('');

    // Validar campos vacíos
    const emptyFields = Object.keys(form).filter(key => !form[key as keyof typeof form]);

    if (emptyFields.length > 0) {
      setErrors(emptyFields);
      setGeneralError(t('auth.errorEmptyFields'));
      return;
    }

    if (!acceptedPrivacy) {
      setGeneralError(t('auth.errorPrivacyRequired'));
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrors(['password', 'confirmPassword']);
      setGeneralError(t('auth.errorPasswordMismatch'));
      return;
    }

    setLoading(true);
    try {
      // Nota: Asegúrate de que tu AuthService.register reciba estos campos
      await AuthService.register({
        email: form.email,
        password: form.password,
        firstName: form.name,
        lastName: form.lastName,
        // birthDate: form.birthDate // Agrégalo si tu servicio ya lo soporta
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

            {/* Header con Logo */}
            <View className="items-center mb-6">
              <Image
                source={LOGO_IMAGE}
                className="w-24 h-24"
                resizeMode="contain"
              />
              <Text className="text-text-primary text-3xl font-extrabold text-center mt-2">
                {t('auth.welcome')}
              </Text>
              <Text className="text-text-secondary text-center">
                {t('auth.createProfile')}
              </Text>
            </View>

            {generalError ? (
              <View className="bg-status-danger/10 p-3 rounded-lg mb-4 border border-status-danger/20">
                <Text className="text-status-danger text-center font-medium">{generalError}</Text>
              </View>
            ) : null}

            {/* Formulario Dinámico */}
            <View className="space-y-4">
              {[
                { label: t('auth.name'), key: 'name', placeholder: t('auth.namePlaceholder'), icon: 'person-outline' },
                { label: t('auth.lastName'), key: 'lastName', placeholder: t('auth.lastNamePlaceholder'), icon: 'people-outline' },
                { label: t('auth.birthDate'), key: 'birthDate', placeholder: t('auth.birthDatePlaceholder'), icon: 'calendar-outline', type: 'numeric' },
                { label: t('auth.email'), key: 'email', placeholder: t('auth.emailPlaceholder'), type: 'email-address', icon: 'mail-outline' },
                { label: t('auth.password'), key: 'password', placeholder: t('auth.passwordPlaceholder'), secure: true, icon: 'lock-closed-outline' },
                { label: t('auth.confirmPassword'), key: 'confirmPassword', placeholder: t('auth.passwordPlaceholder'), secure: true, icon: 'shield-checkmark-outline' },
              ].map((input) => (
                <View key={input.key} className="mb-4">
                  <Text className="text-text-primary font-bold mb-2 ml-1">{input.label}</Text>
                  <View className={`flex-row items-center bg-background-light border ${errors.includes(input.key) ? 'border-status-danger' : 'border-border-light'} rounded-xl px-4 py-3`}>
                    <TextInput
                      placeholder={input.placeholder}
                      placeholderTextColor="#94a3b8"
                      secureTextEntry={input.secure}
                      autoCapitalize="none"
                      keyboardType={(input.type as any) || 'default'}
                      className="flex-1 text-text-primary py-1"
                      value={(form as any)[input.key]}
                      onChangeText={(val) => setForm({ ...form, [input.key]: val })}
                    />
                    <Ionicons name={input.icon as any} size={20} color="#94a3b8" />
                  </View>
                </View>
              ))}
            </View>

            {/* Checkbox de Privacidad */}
            <TouchableOpacity
              onPress={() => setAcceptedPrivacy(!acceptedPrivacy)}
              className="flex-row items-center mt-2 px-1"
              activeOpacity={0.7}
            >
              <View className={`w-5 h-5 border rounded-md mr-3 items-center justify-center ${acceptedPrivacy ? 'bg-primary border-primary' : 'border-border-light bg-surface-light'}`}>
                {acceptedPrivacy && <Ionicons name="checkmark" size={14} color="white" />}
              </View>
              <Text className="text-text-secondary text-[10px] flex-1 leading-4">
                {t('auth.privacyText')} <Text className="text-primary font-bold">{t('auth.privacyPolicy')}</Text> {t('auth.termsText')}
              </Text>
            </TouchableOpacity>

            {/* Botón de Acción */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={loading}
              className={`bg-primary py-4 rounded-xl mt-8 shadow-md ${loading ? 'opacity-70' : ''}`}
            >
              {loading ? <ActivityIndicator color="white" /> : (
                <Text className="text-white text-center font-bold text-lg">{t('auth.finishRegistration')}</Text>
              )}
            </TouchableOpacity>

            {/* Social Register */}
            <View className="mt-8">
              <Text className="text-text-secondary text-center mb-6 text-xs font-bold">{t('auth.orRegisterWith')}</Text>
              <View className="flex-row justify-center space-x-6">
                <TouchableOpacity className="w-12 h-12 rounded-full border border-border-light items-center justify-center bg-white shadow-sm">
                  <Ionicons name="logo-google" size={20} color="#DB4437" />
                </TouchableOpacity>
                <TouchableOpacity className="w-12 h-12 rounded-full border border-border-light items-center justify-center bg-white shadow-sm">
                  <Ionicons name="logo-facebook" size={20} color="#4267B2" />
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