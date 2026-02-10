import React from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Appointment } from '@/types/appointments';

export interface AppointmentCardProps {
  appointment: Appointment;
  patientPhone?: string;
  treatmentName?: string;
  onAccept: (id: string) => void;
  onCancel: (id: string) => void;
  // CORRECCIÓN: Renombramos 'onPress' a 'onPressCard' para que coincida con el Grid
  onPressCard: (id: string) => void; 
}

export const AppointmentCard = ({
  appointment,
  patientPhone,
  treatmentName,
  onAccept,
  onCancel,
  onPressCard // CORRECCIÓN: Recibimos la prop correcta
}: AppointmentCardProps) => {
  const { t } = useTranslation();
  
  if (!appointment) return null;

  const displayTreatment = treatmentName || t('appointments.singleConsultation', 'Consulta General');
  
  const getBorderColorClass = (status: string) => {
      switch(status) {
          case 'scheduled': return 'border-orange-200';
          case 'completed': return 'border-status-success';
          case 'cancelled': return 'border-status-danger';
          default: return 'border-border-light';
      }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'scheduled':
        return {
          label: t('appointmentStatus.scheduled', 'PENDIENTE'),
          containerClass: 'bg-orange-50', 
          textClass: 'text-orange-600',
          showActions: true
        };
      case 'completed':
        return {
          label: t('appointmentStatus.confirmed', 'CONFIRMADO'),
          containerClass: 'bg-status-success-soft',
          textClass: 'text-status-success',
          showActions: false
        };
      case 'cancelled':
        return {
          label: t('appointmentStatus.cancelled', 'CANCELADO'),
          containerClass: 'bg-status-danger-soft',
          textClass: 'text-status-danger',
          showActions: false
        };
      default:
        return {
          label: status || 'Desconocido',
          containerClass: 'bg-surface-secondary',
          textClass: 'text-text-secondary',
          showActions: false
        };
    }
  };

  const config = getStatusConfig(appointment.status);
  const borderColorClass = getBorderColorClass(appointment.status);

  let formattedTime = '--:--';
  try {
      const startTime = appointment.date.toDate();
      formattedTime = new Intl.DateTimeFormat('es-MX', {
        hour: '2-digit', minute: '2-digit', hour12: true
      }).format(startTime);
  } catch (e) {
      console.warn("Error fecha", e);
  }

  return (
    <Pressable
      // CORRECCIÓN: Ejecutamos onPressCard pasando el ID
      onPress={() => onPressCard(appointment.id)}
      style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
      className={`
        bg-surface-light dark:bg-surface-secondary 
        rounded-xl p-3 mb-2 shadow-sm
        border-l-4 ${borderColorClass} 
        ${config.containerClass}
        flex-1 justify-between
      `}
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1 mr-2">
          <Text numberOfLines={1} className="text-lg font-bold text-text-primary dark:text-text-inverse">
            {appointment.patientName || 'Paciente'}
          </Text>
          <Text className="text-sm text-text-secondary font-medium">
            {displayTreatment}
          </Text>
        </View>
        
        <View className="px-2 py-1 rounded-md bg-white/50">
          <Text className={`text-[10px] font-bold ${config.textClass} uppercase`}>
            {config.label}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-4 mb-3">
        <View className="flex-row items-center">
          <MaterialIcons name="access-time" size={14} color="#94a3b8" />
          <Text className="text-xs text-text-secondary ml-1">
            {formattedTime} ({appointment.durationMinutes || 30} min)
          </Text>
        </View>
        
        <View className="flex-row items-center">
          {patientPhone ? (
            <>
              <MaterialIcons name="phone" size={14} color="#94a3b8" />
              <Text className="text-xs text-text-secondary ml-1">{patientPhone}</Text>
            </>
          ) : (
            <>
              <MaterialIcons name="phone-disabled" size={14} color="#94a3b8" />
              <Text className="text-xs text-text-secondary ml-1">{t('data.noPhone', 'Sin contacto')}</Text>
            </>
          )}
        </View>
      </View>

      {config.showActions && (
        <View className="flex-row items-center gap-2 mt-auto pt-2 border-t border-black/5 dark:border-white/10">
          <TouchableOpacity
            onPress={(e) => {
                e.stopPropagation();
                onAccept(appointment.id);
            }}
            activeOpacity={0.7}
            className="flex-1 bg-white/60 py-2 rounded-lg flex-row justify-center items-center"
          >
            <Text className="text-primary font-bold text-sm">{t('actions.confirm', 'Aceptar')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={(e) => {
                e.stopPropagation();
                onCancel(appointment.id);
            }}
            activeOpacity={0.7}
            className="w-10 h-10 bg-status-danger-soft rounded-lg items-center justify-center"
          >
            <MaterialIcons name="close" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      )}
    </Pressable>
  );
};