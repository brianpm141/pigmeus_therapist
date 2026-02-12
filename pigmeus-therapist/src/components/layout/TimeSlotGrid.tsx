import React, { useMemo, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { format, addMinutes, setHours, setMinutes, startOfDay, isSameMinute, addHours, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale'; 
import { Appointment } from '@/types/appointments';
import { AppointmentCard } from '@/features/calendar/components/AppointmentCard';

interface TimeSlotGridProps {
  selectedDate: Date;
  appointments: Appointment[];
  onAddAppointment: (date: Date) => void;
  onCardPress: (id: string) => void;
  onAccept: (id: string) => void;
  onCancel: (id: string) => void;
}

export const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  selectedDate,
  appointments,
  onAddAppointment,
  onCardPress,
  onAccept,
  onCancel
}) => {
  const { t } = useTranslation();
  
  const scrollViewRef = useRef<ScrollView>(null);

  const START_HOUR = 0; 
  const END_HOUR = 24;  
  const SLOT_DURATION = 60; 
  
  const ESTIMATED_SLOT_HEIGHT = 96; 

  useEffect(() => {
    if (isSameDay(selectedDate, new Date())) {
      const now = new Date();
      const currentHour = now.getHours();
      
      const slotsToScroll = Math.max(0, currentHour - 3); 
      
      const yOffset = slotsToScroll * ESTIMATED_SLOT_HEIGHT;

      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: yOffset, animated: true });
      }, 500);
    } else {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  }, [selectedDate]);


  const getNormalizedStart = (date: Date) => {
    return setMinutes(date, 0); 
  };

  const getNormalizedEnd = (date: Date) => {
    const minutes = date.getMinutes();
    if (minutes === 0) return date; 
    return setMinutes(addHours(date, 1), 0); 
  };

  const timeSlots = useMemo(() => {
    const slots = [];
    let current = setMinutes(setHours(startOfDay(selectedDate), START_HOUR), 0);
    const end = setMinutes(setHours(startOfDay(selectedDate), END_HOUR), 0);

    while (current < end) {
      slots.push(new Date(current));
      current = addMinutes(current, SLOT_DURATION);
    }
    return slots;
  }, [selectedDate]);

  const renderGrid = () => {
    const renderedAppIds = new Set<string>();
    const occupiedSlots = new Set<number>();

    return timeSlots.map((slotTime) => {
      const slotTimestamp = slotTime.getTime();

      if (occupiedSlots.has(slotTimestamp)) return null;

      const appointment = appointments.find(app => {
        const realStart = app.date.toDate();
        const normalizedStart = getNormalizedStart(realStart);
        return isSameMinute(normalizedStart, slotTime);
      });

      if (appointment && !renderedAppIds.has(appointment.id)) {
        renderedAppIds.add(appointment.id);

        const realStart = appointment.date.toDate();
        const duration = appointment.durationMinutes || 60; 
        const realEnd = addMinutes(realStart, duration);
        const normalizedEnd = getNormalizedEnd(realEnd); 

        let marker = addMinutes(slotTime, SLOT_DURATION);
        while (marker < normalizedEnd) {
          occupiedSlots.add(marker.getTime());
          marker = addMinutes(marker, SLOT_DURATION);
        }

        return (
          <View key={`app-${appointment.id}`} className="flex-row mb-4">
            <View className="w-16 items-center justify-start pt-2 mr-2">
              <Text className="text-text-secondary font-bold text-xs">
                {format(slotTime, 'h:mm')}
              </Text>
              <Text className="text-text-secondary/50 text-[10px] uppercase mb-1">
                {format(slotTime, 'a')}
              </Text>
              
              <View className="w-[1px] h-3 bg-gray-300 dark:bg-gray-600 my-0.5" />

              <Text className="text-text-secondary/70 font-medium text-[10px]">
                {format(normalizedEnd, 'h:mm')}
              </Text>
            </View>
            
            <View className="flex-1">
              <AppointmentCard 
                appointment={appointment}
                onPressCard={(id) => onCardPress(id)}
                onAccept={(id) => onAccept(id)}
                onCancel={(id) => onCancel(id)}
              />
            </View>
          </View>
        );
      }

      return (
        <View key={`slot-${slotTime.toISOString()}`} className="flex-row items-center mb-4 h-20">
          <View className="w-16 items-center justify-center mr-2">
            <Text className="text-text-secondary font-medium text-xs">
              {format(slotTime, 'h:mm')}
            </Text>
            <Text className="text-text-secondary/50 text-[10px] uppercase">
              {format(slotTime, 'a')}
            </Text>
          </View>
          
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => onAddAppointment(slotTime)}
            className="flex-1 h-full border-2 border-dashed border-border-light dark:border-border-dark rounded-2xl bg-surface-light/50 dark:bg-surface-dark/30 flex-row items-center justify-start pl-6"
          >
            <View className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center mr-3">
              <MaterialIcons name="add" size={20} color="#94a3b8" />
            </View>
            <Text className="text-text-secondary font-medium text-sm">
              {t('appointments.availableSpace', 'Espacio disponible')}
            </Text>
          </TouchableOpacity>
        </View>
      );
    });
  };

  return (
    <ScrollView 
      ref={scrollViewRef} 
      className="flex-1 px-4 pt-4" 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {renderGrid()}
    </ScrollView>
  );
};