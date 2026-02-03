import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ConsultationItem } from '@/types/appointments';
import { format, differenceInWeeks } from 'date-fns';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

interface Props {
  item: ConsultationItem;
  onCancel: (id: string, isPattern: boolean) => void;
}

export const AppointmentCard = ({ item, onCancel }: Props) => {
  const { t } = useTranslation();
  const isPeriodic = item.type === 'periodic';

  const patientName = item.data.patientName;
  // Hora para el encabezado (HH:mm)
  const timeString = format(item.nextDate, 'HH:mm');

  let detailsText = '';
  let subDetailsText = '';

  if (isPeriodic) {
    const pattern = item.data;
    const dayLabels: Record<string, string> = {
      'L': t('days.mondayShort'),
      'M1': t('days.tuesdayShort'),
      'M2': t('days.wednesdayShort'),
      'J': t('days.thursdayShort'),
      'V': t('days.fridayShort'),
      'S': t('days.saturdayShort'),
      'D': t('days.sundayShort')
    };
    // @ts-ignore
    const daysStr = pattern.daysOfWeek.map(d => dayLabels[d]).join(', ');

    detailsText = daysStr; // Ej: "Lun, Mié"

    const weeksLeft = differenceInWeeks(pattern.lastGeneratedDate.toDate(), new Date());
    subDetailsText = weeksLeft > 20
      ? t('appointments.inProgress')
      : t('appointments.weeksLeft', { count: weeksLeft });
  } else {
    detailsText = format(item.data.date.toDate(), 'dd/MM/yyyy');
    subDetailsText = item.data.notes || t('appointments.singleConsultation');
  }

  return (
    <View className="bg-surface-light dark:bg-surface-dark p-4 mb-3 rounded-3xl shadow-sm border border-border-light dark:border-border-dark">

      {/* Cabecera: Hora y Etiqueta */}
      <View className="flex-row justify-between items-start mb-2">
        <View>
          <Text className="text-primary font-extrabold text-2xl font-sans tracking-tight">
            {timeString}
          </Text>

          <View className={`self-start px-2 py-0.5 rounded-md mt-1 ${isPeriodic ? 'bg-green-100' : 'bg-blue-50'}`}>
            <View className="flex-row items-center">
              <MaterialIcons
                name={isPeriodic ? "repeat" : "event"}
                size={10}
                color={isPeriodic ? "#22c55e" : "#64748b"}
              />
              <Text className={`text-[10px] font-bold ml-1 uppercase ${isPeriodic ? 'text-green-600' : 'text-slate-500'}`}>
                {isPeriodic ? t('appointments.periodic') : t('appointments.single')}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => onCancel(item.data.id, isPeriodic)}
          className="bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-full flex-row items-center"
        >
          <Feather name="x-circle" size={12} color="#ef4444" />
          <Text className="text-status-danger font-bold ml-1 text-xs">
            {t('actions.cancel')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Nombre Paciente */}
      <Text className="text-text-primary dark:text-text-inverse font-bold text-lg font-sans mb-2">
        {patientName}
      </Text>

      {/* Footer: Detalles */}
      <View className="flex-row items-center border-t border-border-light dark:border-border-dark pt-3 mt-1">
        {isPeriodic ? (
          <>
            <View className="flex-row items-center mr-3">
              <Feather name="bar-chart-2" size={14} color="#22c55e" />
              <Text className="text-text-secondary text-xs font-bold ml-1.5">
                {detailsText}
              </Text>
            </View>
            <View className="w-[1px] h-3 bg-gray-300 mx-2" />
            <Text className="text-text-secondary text-xs font-medium">
              {subDetailsText}
            </Text>
          </>
        ) : (
          <>
            <View className="flex-row items-center mr-3">
              {/* Icono de Calendario para indicar que es una fecha específica */}
              <Feather name="calendar" size={14} color="#64748b" />
              <Text className="text-text-secondary text-xs font-bold ml-1.5">
                {detailsText}
              </Text>
            </View>

            {/* Opcional: Separador y Notas originales si las quieres mantener al lado */}
            <View className="w-[1px] h-3 bg-gray-300 mx-2" />
            <Text className="text-text-secondary text-xs font-medium" numberOfLines={1}>
              {subDetailsText}
            </Text>
          </>
        )}
      </View>

    </View>
  );
};