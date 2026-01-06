import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';

// Interfaces locales para el componente visual
interface DayItem {
  date: Date;
  dayName: string; // "Lun", "Mar"
  dayNumber: string; // "12", "13"
  isToday: boolean;
}

interface CalendarStripProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export const CalendarStrip = ({ selectedDate, onSelectDate }: CalendarStripProps) => {
  const [days, setDays] = useState<DayItem[]>([]);

  // Generar los próximos 7 días al montar el componente
  useEffect(() => {
    const nextDays: DayItem[] = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Formateadores nativos de JS (Intl es muy rápido en móviles modernos)
      const dayName = new Intl.DateTimeFormat('es-MX', { weekday: 'short' }).format(date);
      const dayNumber = new Intl.DateTimeFormat('es-MX', { day: 'numeric' }).format(date);

      nextDays.push({
        date: date,
        // Quitamos el punto que a veces pone Intl (ej: "lun.")
        dayName: dayName.replace('.', '').charAt(0).toUpperCase() + dayName.slice(1, 3), 
        dayNumber: dayNumber,
        isToday: i === 0,
      });
    }
    setDays(nextDays);
  }, []);

  // Función para comparar si dos fechas son el mismo día (ignora horas)
  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() && 
           d1.getMonth() === d2.getMonth() && 
           d1.getFullYear() === d2.getFullYear();
  };

  return (
    <View className="py-4 bg-background-light dark:bg-background-dark">
      <FlatList
        data={days}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }} // Gap funciona en RN 0.73+
        keyExtractor={(item) => item.date.toISOString()}
        renderItem={({ item }) => {
          const isSelected = isSameDay(item.date, selectedDate);

          return (
            <TouchableOpacity
              onPress={() => onSelectDate(item.date)}
              className={`
                items-center justify-center w-16 h-20 rounded-2xl border 
                ${isSelected 
                  ? 'bg-primary border-primary shadow-lg shadow-primary/30' 
                  : 'bg-surface-light border-gray-100 dark:bg-surface-dark dark:border-surface-darker'}
              `}
            >
              <Text 
                className={`text-sm mb-1 ${isSelected ? 'text-white' : 'text-gray-400 font-medium'}`}
              >
                {item.dayName}
              </Text>
              
              <Text 
                className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}
              >
                {item.dayNumber}
              </Text>

              {/* Puntito indicador si es HOY y no está seleccionado */}
              {item.isToday && !isSelected && (
                <View className="mt-1 w-1 h-1 rounded-full bg-primary" />
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};