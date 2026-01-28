import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AuthService } from '@/services/authService';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { Input } from '@/components/ui/UIComponents';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const LOGO_IMAGE = require('@/assets/logo.png');

  // Estados de UI
  const [showPassword, setShowPassword] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Estados de Formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [generalError, setGeneralError] = useState('');

const [request, response, promptAsync] = Google.useAuthRequest({
  androidClientId: '511097728792-07b50cvlqehtesr66kupini4vhp4iefn.apps.googleusercontent.com',
  webClientId: '511097728792-k5gujm9a01nb7ajienrmsvvec93fals0.apps.googleusercontent.com',
  redirectUri: AuthSession.makeRedirectUri({
    path: 'redirect',
  }),
});

  // Manejo de respuesta de Google
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleLogin(id_token);
    } else if (response?.type === 'cancel' || response?.type === 'error') {
      setLoadingGoogle(false);
    }
  }, [response]);

  const handleGoogleLogin = async (idToken: string) => {
    setLoadingGoogle(true);
    try {
      await AuthService.loginWithGoogle(idToken);
      // El NavigationGuard hará el resto
    } catch (error) {
      setGeneralError(t('auth.errorGoogle'));
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleLogin = async () => {
    setErrors([]);
    setGeneralError('');

    if (!email || !password) {
      setErrors([!email ? 'email' : '', !password ? 'password' : ''].filter(Boolean));
      setGeneralError(t('auth.errorCredentials'));
      return;
    }

    setLoading(true);
    try {
      await AuthService.login({ email, password });
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
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
    <SafeAreaView className="flex-1 bg-background-light px-6">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1 justify-center"
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          
          <View className="bg-surface-light p-8 rounded-3xl shadow-sm border border-border-light">

            {/* Logo */}
            <View className="items-center mb-4">
              <Image source={LOGO_IMAGE} className="w-32 h-32" resizeMode="contain" />
            </View>

            <Text className="text-text-primary text-3xl font-extrabold text-center mb-2">{t('auth.welcome')}</Text>
            <Text className="text-text-secondary text-center mb-6">{t('auth.managePatients')}</Text>

            {generalError ? (
              <View className="bg-status-danger/10 p-3 rounded-lg mb-4 border border-status-danger/20">
                <Text className="text-status-danger text-center font-medium">{generalError}</Text>
              </View>
            ) : null}

            {/* Formulario usando tus componentes Input */}
            <View className="gap-y-2">
              <Input
                label={t('auth.email')}
                placeholder={t('auth.emailPlaceholder')}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                error={errors.includes('email') ? ' ' : undefined}
              />

              <View className="relative">
                <Input
                  label={t('auth.password')}
                  placeholder={t('auth.passwordPlaceholder')}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
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
            </View>

            <TouchableOpacity className="mt-4 items-end" onPress={() => {/* Lógica de recuperar */}}>
              <Text className="text-primary font-medium">{t('auth.forgotPassword')}</Text>
            </TouchableOpacity>

            {/* Botón Login */}
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

            {/* Social Login */}
            <View className="mt-8">
              <Text className="text-text-secondary text-center mb-6 text-xs font-bold uppercase tracking-widest">
                {t('auth.orLoginWith')}
              </Text>
              <View className="flex-row justify-center">
                <TouchableOpacity 
                  onPress={() => {
                    setLoadingGoogle(true);
                    promptAsync();
                  }}
                  disabled={!request || loadingGoogle}
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
              <Text className="text-text-secondary">{t('auth.noAccount')} </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <Text className="text-primary font-bold">{t('auth.register')}</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}