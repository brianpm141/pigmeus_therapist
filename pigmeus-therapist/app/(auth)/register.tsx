import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AuthService } from '@/services/authService';
// Importamos tus componentes UI estandarizados
import { Input, DatePicker } from '@/components/ui/UIComponents';

export default function RegisterScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const LOGO_IMAGE = require('@/assets/logo.png');

  // Estado del formulario con tipos correctos
  const [form, setForm] = useState({
    name: '',
    lastName: '',
    birthDate: new Date(1995, 0, 1), // Inicializado como Date
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const handleRegister = async () => {
    setErrors([]);
    setGeneralError('');

    // Validar campos obligatorios (excepto birthDate que ya tiene valor)
    const requiredFields = ['name', 'lastName', 'email', 'password', 'confirmPassword'];
    const emptyFields = requiredFields.filter(key => !form[key as keyof typeof form]);

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
      await AuthService.register({
        email: form.email,
        password: form.password,
        firstName: form.name,
        lastName: form.lastName,
        birthDate: form.birthDate, // Se envía como objeto Date
        photoURL: '' // Por defecto vacío como solicitaste
      });
      // El router.replace suele manejarse en el AuthProvider, pero puedes forzarlo aquí si es necesario
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

            {/* Inputs de Texto */}
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

              {/* Uso del DatePicker estandarizado para la fecha de nacimiento */}
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
              <Input
                label={t('auth.password')}
                placeholder={t('auth.passwordPlaceholder')}
                secureTextEntry
                value={form.password}
                onChangeText={(val) => setForm({ ...form, password: val })}
                error={errors.includes('password') ? ' ' : undefined}
              />
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

            {/* Botón de Registro */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={loading}
              className={`bg-primary py-4 rounded-xl mt-8 shadow-md ${loading ? 'opacity-70' : ''}`}
            >
              {loading ? <ActivityIndicator color="white" /> : (
                <Text className="text-white text-center font-bold text-lg">{t('auth.finishRegistration')}</Text>
              )}
            </TouchableOpacity>

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