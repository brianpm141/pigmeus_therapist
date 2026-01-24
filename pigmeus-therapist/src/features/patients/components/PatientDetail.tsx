import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { FloatingFormContainer } from '@/components/layout/Molecules';
import { FormButton } from '@/components/ui/UIComponents'; 
import { Patient } from '@/types/patient';

interface PatientDetailProps {
    visible: boolean;
    onClose: () => void;
    patient: Patient | null;
    onEdit: () => void;
    onDelete :() => void;
}

export const PatientDetail = ({ visible, onClose, patient, onEdit , onDelete}: PatientDetailProps) => {
  const { t } = useTranslation();

  if (!patient) return null;

  // Lógica para calcular edad en años, meses o días según corresponda
  const getAgeDisplay = () => {
    if (!patient.personalInfo?.bornDate) return { value: '--', unit: t('data.years') };
    
    const birth = (patient.personalInfo.bornDate as any).toDate();
    
    const now = new Date();
    
    // Cálculo de diferencia total en tiempo
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    // Ajuste si el día actual es menor al día de nacimiento
    if (days < 0) {
      months--;
      // Obtener días del mes anterior
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      days += lastMonth;
    }

    // Ajuste si el mes actual es menor al mes de nacimiento
    if (months < 0) {
      years--;
      months += 12;
    }

    // Prioridad de visualización:
    // 1. Si tiene 1 año o más
    if (years >= 1) {
      return { value: years.toString(), unit: t('data.years') };
    }

    // 2. Si es menor a un año pero tiene 1 mes o más
    if (months >= 1) {
      return { value: months.toString(), unit: t('data.months') };
    }

    // 3. Si es menor a un mes (mes 0), mostrar días
    return { value: Math.max(0, days).toString(), unit: t('data.days') };
  };

  const ageData = getAgeDisplay();

  const formatDate = (date: any) => {
    if (!date) return null;
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <FloatingFormContainer visible={visible} onClose={onClose} iconName='airline-seat-flat-angled' title={t('common.details') }>
        
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* HEADER: Nombre y Estado */}
        <View className="items-center mb-8">
          <Text className="text-text-primary dark:text-text-inverse font-extrabold text-3xl text-center">
            {patient.fullName}
          </Text>
        </View>

        {/* MÉTRICAS: Estilo de tarjetas elevadas */}
        <View className="flex-row justify-between mb-8 gap-x-2">
          <MetricBox label={t('data.age')} value={ageData.value} unit={ageData.unit} />
          <MetricBox label={t('data.weight')} value={patient.physicalMetrcs?.weight ? `${patient.physicalMetrcs.weight}` : '--'} unit="kg" />
          <MetricBox label={t('data.height')} value={patient.physicalMetrcs?.height ? `${patient.physicalMetrcs.height}` : '--'} unit="m" />
        </View>

        {/* SECCIÓN: INFORMACIÓN PERSONAL */}
        <SectionHeader title={t('data.personalInfo')} icon="person" />
        <View className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl p-5 mb-6 shadow-sm">
          <InfoRow label={t('data.birthDate')} value={formatDate(patient.personalInfo?.bornDate) || t('data.noData')} />
          <InfoRow label={t('data.gender')} value={t(`data.${patient.personalInfo?.gender}`) || t('data.noGender')} />
          <InfoRow 
            label={t('data.phone')} 
            value={patient.contact?.phone || t('data.noPhone')} 
            isPhone 
            onPress={() => patient.contact?.phone && Linking.openURL(`tel:${patient.contact.phone}`)}
          />
          <InfoRow label={t('data.address')} value={patient.contact?.address || t('data.noAddress')} last />
        </View>

        {/* SECCIÓN: INFORMACIÓN CLÍNICA (Con bloques de color sutil) */}
        <SectionHeader title={t('data.medicalInfo')} icon="medical-services" />
        <View className="mb-6 gap-y-4">
          <View className="bg-status-info-soft rounded-3xl p-5 border border-primary/10">
            <Text className="text-primary font-extrabold text-[11px] uppercase tracking-wider mb-2">
              {t('data.diagnosis')}
            </Text>
            <Text className="text-text-primary dark:text-text-inverse font-medium leading-6 text-[15px]">
              {patient.clinicalRecord?.diagnosis || t('data.noDiagnosis')}
            </Text>
          </View>

          <View className="bg-status-success-soft rounded-3xl p-5 border border-status-success/10">
            <Text className="text-status-success font-extrabold text-[11px] uppercase tracking-wider mb-2">
              {t('data.treatmentPlan')}
            </Text>
            <Text className="text-text-primary dark:text-text-inverse font-medium leading-6 text-[15px]">
              {patient.clinicalRecord?.treatmentPlan || t('data.noTreatmentPlan')}
            </Text>
          </View>
        </View>

        {/*CONTACTO DE EMERGENCIA */}
        <SectionHeader title={t('FormPatient.emergencyContact')} icon="emergency" />
            <View className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl p-5 mb-6 shadow-sm">
            <InfoRow label={t('data.emergencyContact')} value={patient.contact?.emergencyContactName || t('data.noData')} />
            <InfoRow 
                label={t('data.emergencyPhone')} 
                value={patient.contact?.emergencyContactPhone || t('data.noPhone')} 
                isPhone 
                onPress={() => patient.contact?.emergencyContactPhone && Linking.openURL(`tel:${patient.contact.emergencyContactPhone}`)}
            />
            </View>

        {/* BOTÓN EDITAR */}
        <FormButton title={t('actions.edit')} onPress={onEdit} iconName='edit'/>
        {/* BOTÓN ELIMINAR */}
        <FormButton title={t('actions.delete')} onPress={ onDelete } iconName='delete-forever' variant='danger'/>

      </ScrollView>
    </FloatingFormContainer>
  );
};

// --- Subcomponentes con Estilo Refinado ---

const MetricBox = ({ label, value, unit }: { label: string, value: string, unit: string }) => (
  <View className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl p-5 items-center flex-1 mx-1 shadow-sm">
    <Text className="text-text-secondary text-[10px] font-extrabold uppercase tracking-tight mb-2">{label}</Text>
    <View className="flex-row items-baseline">
      <Text className="text-text-primary dark:text-text-inverse font-extrabold text-xl">{value}</Text>
      <Text className="text-text-secondary font-medium text-[10px] ml-1">{unit}</Text>
    </View>
  </View>
);

const SectionHeader = ({ title, icon }: { title: string, icon: any }) => (
  <View className="flex-row items-center mb-4 mt-2">
    <View className="bg-primary/10 p-2 rounded-xl mr-3">
      <MaterialIcons name={icon} size={18} className="text-primary" />
    </View>
    <Text className="text-text-primary dark:text-text-inverse font-extrabold text-xl">{title}</Text>
  </View>
);

const InfoRow = ({ label, value, last, isPhone, onPress }: { label: string, value: string, last?: boolean, isPhone?: boolean, onPress?: () => void }) => (
  <TouchableOpacity 
    disabled={!onPress} 
    onPress={onPress}
    className={`flex-row justify-between items-center py-4 ${!last ? 'border-b border-border-light dark:border-border-dark' : ''}`}
  >
    <Text className="text-text-secondary font-medium text-sm">{label}</Text>
    <View className="flex-row items-center flex-1 justify-end ml-4">
      <Text className={`font-bold text-sm text-right ${isPhone ? 'text-primary' : 'text-text-primary dark:text-text-inverse'}`} numberOfLines={1}>
        {value}
      </Text>
      {isPhone && <MaterialIcons name="chevron-right" size={16} className="text-primary ml-1" />}
    </View>
  </TouchableOpacity>
);