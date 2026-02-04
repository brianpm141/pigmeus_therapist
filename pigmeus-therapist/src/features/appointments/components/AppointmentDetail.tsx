import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { FloatingFormContainer } from '@/components/layout/Molecules';
import { FormButton } from '@/components/ui/UIComponents';
import { ConsultationItem } from '@/types/appointments';
import { format, addDays, differenceInWeeks } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  visible: boolean;
  item: ConsultationItem | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const AppointmentDetail = ({ visible, item, onClose, onEdit, onDelete }: Props) => {
  const { t } = useTranslation();

  if (!item) return null;

  const isPeriodic = item.type === 'periodic';
  const patientName = item.data.patientName;
  const timeString = format(item.nextDate, 'HH:mm');

  // --- LÓGICA DE VISUALIZACIÓN ---
  
  // 1. Próximas fechas (Solo para periódicas)
  const getNextDates = () => {
    if (!isPeriodic) return [];
    const dates = [];
    const pattern = item.data;
    const dayMap: Record<string, number> = { 'D': 0, 'L': 1, 'M1': 2, 'M2': 3, 'J': 4, 'V': 5, 'S': 6 };
    const targetDays = pattern.daysOfWeek.map(d => dayMap[d]);
    
    // Calculamos las siguientes 3 ocurrencias
    let count = 0;
    let checkDate = new Date();
    while (count < 3 && count < 100) { // Safety break
      checkDate = addDays(checkDate, 1);
      if (targetDays.includes(checkDate.getDay())) {
        dates.push(checkDate);
        count++;
      }
    }
    return dates;
  };

  return (
    <FloatingFormContainer 
      visible={visible} 
      onClose={onClose} 
      title={t('common.details')} 
      iconName="event-note"
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* HEADER: Hora y Tipo */}
        <View className="items-center mb-6">
          <Text className="text-primary font-extrabold text-5xl font-sans tracking-tighter">
            {timeString}
          </Text>
          <View className={`mt-2 px-3 py-1 rounded-full ${isPeriodic ? 'bg-green-100' : 'bg-blue-100'}`}>
            <Text className={`font-bold text-xs uppercase ${isPeriodic ? 'text-green-700' : 'text-blue-700'}`}>
              {isPeriodic ? 'Tratamiento Recurrente' : 'Consulta Única'}
            </Text>
          </View>
        </View>

        {/* PACIENTE */}
        <SectionHeader title="Paciente" icon="person" />
        <View className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl mb-6 border border-border-light dark:border-border-dark">
          <Text className="text-xl font-bold text-text-primary dark:text-text-inverse">
            {patientName}
          </Text>
        </View>

        <SectionHeader title="Planificación" icon="schedule" />
        <View className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl mb-6 border border-border-light dark:border-border-dark">
          {isPeriodic ? (
            <>
              <InfoRow label="Frecuencia" value="Semanal" />
              <InfoRow 
                label="Días" 
                value={item.data.daysOfWeek.join(', ')} 
              />
              <InfoRow 
                label="Estado" 
                value={
                  differenceInWeeks(item.data.lastGeneratedDate.toDate(), new Date()) > 20 
                  ? "Indefinido (Hasta cancelar)" 
                  : `Termina en ${differenceInWeeks(item.data.lastGeneratedDate.toDate(), new Date())} semanas`
                } 
                last
              />
              
              {/* Próximas sesiones */}
              <View className="mt-4 pt-4 border-t border-border-light dark:border-border-dark">
                <Text className="text-xs font-bold text-text-secondary uppercase mb-2">Próximas Sesiones</Text>
                {getNextDates().map((d, i) => (
                  <View key={i} className="flex-row items-center mb-2">
                    <Feather name="calendar" size={14} color="#94a3b8" />
                    <Text className="ml-2 text-text-primary dark:text-text-inverse font-medium">
                      {format(d, "EEEE d 'de' MMMM", { locale: es })}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <>
              <InfoRow 
                label="Fecha" 
                value={format(item.data.date.toDate(), "EEEE d 'de' MMMM, yyyy", { locale: es })} 
              />
              <InfoRow label="Duración" value={`${item.data.durationMinutes} min`} last />
            </>
          )}
        </View>

        {/* ACCIONES */}
        <FormButton 
          title="Editar Consulta" 
          onPress={onEdit} 
          iconName="edit" 
          variant="outline" 
          className="mb-3"
        />
        <FormButton 
          title={isPeriodic ? "Detener Tratamiento" : "Cancelar Cita"} 
          onPress={onDelete} 
          iconName="delete-forever" 
          variant="danger" 
        />

      </ScrollView>
    </FloatingFormContainer>
  );
};

// Componentes Auxiliares para el Detalle
const SectionHeader = ({ title, icon }: { title: string, icon: any }) => (
  <View className="flex-row items-center mb-3">
    <MaterialIcons name={icon} size={18} color="#94a3b8" />
    <Text className="text-text-secondary font-bold text-sm uppercase ml-2 tracking-wider">
      {title}
    </Text>
  </View>
);

const InfoRow = ({ label, value, last }: { label: string, value: string, last?: boolean }) => (
  <View className={`flex-row justify-between py-3 ${!last ? 'border-b border-border-light dark:border-border-dark' : ''}`}>
    <Text className="text-text-secondary font-medium">{label}</Text>
    <Text className="text-text-primary dark:text-text-inverse font-bold">{value}</Text>
  </View>
);