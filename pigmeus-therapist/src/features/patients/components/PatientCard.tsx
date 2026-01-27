import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { Patient } from '@/types/patient';

interface PatientCardProps {
  patient: Patient;
  onPress: () => void;
}

export const PatientCard = ({ patient, onPress }: PatientCardProps) => {
  const { t } = useTranslation();

  // --- LÓGICA DE EDAD (Años, Meses o Días) ---
  const getAgeDisplay = () => {
    if (!patient.personalInfo?.bornDate) return { value: '--', unit: t('data.years') };

    // Al ser siempre Timestamp, usamos .toDate()
    const birth = (patient.personalInfo.bornDate as any).toDate();
    const now = new Date();

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      days += lastMonth;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years >= 1) return { value: years.toString(), unit: t('data.years') };
    if (months >= 1) return { value: months.toString(), unit: t('data.months') };
    return { value: Math.max(0, days).toString(), unit: t('data.days') };
  };

  const ageData = getAgeDisplay();
  const hasAppointment = !!patient.nextAppointment;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="w-full bg-surface-light dark:bg-surface-dark py-8 px-5 rounded-2xl mb-4  shadow-sm"
    >
      {/* nombre y cita*/}
      <View className="flex-row justify-between items-start mb-1">
        <Text className="text-text-primary dark:text-text-inverse font-bold text-xl flex-1 mr-2" numberOfLines={1}>
          {patient.fullName}
        </Text>

        <View className={`${hasAppointment ? 'bg-primary/10' : 'bg-orange-100'} px-3 py-1 rounded-full flex-row items-center`}>
          <MaterialIcons
            name="event"
            size={12}
            className={hasAppointment ? "text-primary" : "text-orange-700"}
          />
          <Text className={`font-bold text-[10px] uppercase tracking-wider ml-1 ${hasAppointment ? 'text-primary' : 'text-orange-700'}`}>
            {hasAppointment ? patient.nextAppointment : t('data.noPending')}
          </Text>
        </View>
      </View>

      {/* telefono */}
      <View className="my-5">
        <View className="flex-row items-center">
          <MaterialIcons name="phone" size={16} className="text-primary" />
          <Text className="text-primary font-medium text-sm ml-2">
            {patient.contact.phone || '--- --- ----'}
          </Text>
        </View>
      </View>

      {/* 3. SECCIÓN DE MÉTRICAS (Cápsula inferior) */}
      <View className="bg-background-light dark:bg-background-dark rounded-2xl p-4 flex-row justify-between items-center">

        {/* EDAD (DINÁMICA) */}
        <View className="items-center flex-1 border-r border-border-light dark:border-border-dark">
          <Text className="text-text-secondary text-[10px] font-bold uppercase mb-1">
            {t('data.age')}
          </Text>
          <View className="flex-row items-baseline">
            <Text className="text-text-primary dark:text-text-inverse font-bold text-lg">
              {ageData.value}
            </Text>
            <Text className="text-text-secondary text-[10px] ml-1">{ageData.unit}</Text>
          </View>
        </View>

        {/* PESO */}
        <View className="items-center flex-1 border-r border-border-light dark:border-border-dark">
          <Text className="text-text-secondary text-[10px] font-bold uppercase mb-1">
            {t('data.weight')}
          </Text>
          <View className="flex-row items-baseline">
            <Text className="text-text-primary dark:text-text-inverse font-bold text-lg">
              {patient.physicalMetrics.weight}
            </Text>
            <Text className="text-text-secondary text-[10px] ml-1">kg</Text>
          </View>
        </View>

        {/* ESTATURA */}
        <View className="items-center flex-1">
          <Text className="text-text-secondary text-[10px] font-bold uppercase mb-1">
            {t('data.height')}
          </Text>
          <View className="flex-row items-baseline">
            <Text className="text-text-primary dark:text-text-inverse font-bold text-lg">
              {patient.physicalMetrics.height}
            </Text>
            <Text className="text-text-secondary text-[10px] ml-1">m</Text>
          </View>
        </View>

      </View>
    </TouchableOpacity>
  );
};