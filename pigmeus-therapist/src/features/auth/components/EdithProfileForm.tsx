import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { Input, DatePicker, FormButton } from '@/components/ui/UIComponents';
import { FormSection, FormPairRows } from '@/components/layout/Molecules';
import { StatCard } from './StatCard';
import { useAuth } from '@/features/auth/AuthContext';
import { useTheme } from '@/core/ThemeContext';
import { updateTherapistProfile } from '@/services/authService';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '@/services/storageService';

interface EditProfileFormProps {
  onResult: (success: boolean) => void;
}

export const EditProfileForm = ({ onResult }: EditProfileFormProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user, userProfile } = useAuth();

  // Referencias de imagen y assets
  const DEFAULT_AVATAR = require('@/assets/logo.png');
  const [photoUri, setPhotoUri] = useState<string | null>(userProfile?.photoURL || null);

  // Estados locales de formulario
  const [firstName, setFirstName] = useState(userProfile?.firstName || '');
  const [lastName, setLastName] = useState(userProfile?.lastName || '');
  const [loading, setLoading] = useState(false);

  /**
   * Normalización de la fecha inicial:
   * Convierte Timestamps de Firebase o strings a objetos Date nativos[cite: 148].
   */
  const getInitialDate = (): Date => {
    if (!userProfile?.birthDate) return new Date(1990, 4, 15);
    
    // Si ya es un objeto Date
    if (userProfile.birthDate instanceof Date) return userProfile.birthDate;
    
    // Si es un Timestamp de Firestore (tiene método toDate)
    if (typeof userProfile.birthDate === 'object' && 'toDate' in userProfile.birthDate) {
      return (userProfile.birthDate as any).toDate();
    }
    
    // Fallback para otros formatos
    return new Date(userProfile.birthDate as any);
  };

  const [birthDate, setBirthDate] = useState<Date>(getInitialDate());

  // --- LÓGICA DE SELECCIÓN DE IMAGEN ---
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  // --- LÓGICA DE GUARDADO ---
  const handleSave = async () => {
    if (!user?.uid) return;
    setLoading(true);

    try {
      let finalPhotoURL = userProfile?.photoURL || '';

      // Subida de imagen a Firebase Storage si la URI es local
      if (photoUri && !photoUri.startsWith('http')) {
        finalPhotoURL = await uploadImage(photoUri, `profiles/${user.uid}`);
      }

      // Actualización del perfil incluyendo el campo birthDate [cite: 156]
      await updateTherapistProfile(user.uid, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        photoURL: finalPhotoURL,
        birthDate: birthDate 
      });

      onResult(true);
    } catch (e) {
      console.error("Error al guardar perfil:", e);
      onResult(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1">
      {/* SECCIÓN FOTO DE PERFIL */}
      <View className="items-center my-6">
        <TouchableOpacity onPress={pickImage} activeOpacity={0.8} className="relative">
          <View className="w-24 h-24 rounded-full bg-border-light dark:bg-border-dark overflow-hidden border-2 border-primary">
            <Image
              source={photoUri ? { uri: photoUri } : DEFAULT_AVATAR}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <View className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border-2 border-surface-light dark:border-surface-dark">
            <MaterialIcons name="photo-camera" size={16} color="white" />
          </View>
        </TouchableOpacity>
        <Text className="mt-2 text-primary font-medium">{t('auth.changePhoto')}</Text>
      </View>

      {/* INFORMACIÓN PERSONAL [cite: 79, 87] */}
      <FormSection titleKey="auth.personalInfo" iconName="person">
        <Input
          label={t('auth.name')}
          value={firstName}
          onChangeText={setFirstName}
          placeholder={t('auth.namePlaceholder')}
        />
        <Input
          label={t('auth.lastName')}
          value={lastName}
          onChangeText={setLastName}
          placeholder={t('auth.lastNamePlaceholder')}
        />
        {/* Selector de fecha adaptativo  */}
        <DatePicker
          label={t('auth.birthDate')}
          value={birthDate}
          onChange={(date) => setBirthDate(date)}
        />

        <TouchableOpacity
          className="bg-primary/10 py-3 rounded-xl items-center mt-2 border border-primary/20"
          onPress={() => console.log('Navegar a cambio de pass')}
        >
          <View className="flex-row items-center">
            <MaterialIcons name="lock-reset" size={20} color={colors.primary} />
            <Text className="ml-2 text-primary font-medium">{t('auth.changePassword')}</Text>
          </View>
        </TouchableOpacity>
      </FormSection>

      {/* SECCIÓN DE ESTADÍSTICAS [cite: 62, 70] */}
      <View className="mx-6 mt-6">
        <View className="flex-row items-center mb-4">
          <MaterialIcons name="insert-chart" size={20} color={colors.primary} />
          <Text className="ml-2 text-text-secondary font-bold text-xs uppercase tracking-widest">
            {t('auth.yourStats')}
          </Text>
        </View>

        <FormPairRows>
          <StatCard
            label={t('auth.patients')}
            value={userProfile?.stats?.totalPatients || 0}
          />
          <StatCard
            label={t('auth.sessions')}
            value={userProfile?.stats?.totalAppointments || 0}
            subtext={t('auth.annualTotal')}
            subtextColor="text-text-secondary"
          />
        </FormPairRows>
      </View>

      <View className="mt-6 px-4 mb-8">
        <FormButton
          title={t('actions.save')}
          onPress={handleSave}
          isLoading={loading}
          iconName="save"
        />
      </View>
    </View>
  );
};