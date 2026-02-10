import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/core/ThemeContext'; // Ajusta si tu ruta es distinta
import { format, addDays, isSameDay, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

// --- COMPONENTE ITEM (Optimizado con Memo) ---
const DateStripItem = React.memo(({ item, isSelected, onSelect, colors }: any) => {
  const dayName = format(item, 'EEE', { locale: es }).replace('.', '').toUpperCase();
  const dayNumber = format(item, 'd');

  return (
    <TouchableOpacity
      onPress={() => onSelect(item)}
      activeOpacity={0.7}
      className={`mr-3 items-center justify-center rounded-2xl w-[58px] h-[72px] border ${
        isSelected ? 'bg-primary border-primary' : 'bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark'
      }`}
      style={isSelected ? { shadowColor: colors.primary, shadowOpacity: 0.3, shadowRadius: 4, elevation: 4 } : {}}
    >
      <Text 
        className={`text-xs mb-1 font-medium ${isSelected ? 'text-white' : 'text-text-secondary'}`}
      >
        {dayName}
      </Text>
      <Text 
        className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-text-primary dark:text-text-inverse'}`}
      >
        {dayNumber}
      </Text>
    </TouchableOpacity>
  );
}, (prev, next) => {
  return isSameDay(prev.item, next.item) && prev.isSelected === next.isSelected;
});

interface DateStripProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onCalendarPress?: () => void;
}

export const DateStrip: React.FC<DateStripProps> = ({ 
  selectedDate, 
  onSelectDate,
  onCalendarPress 
}) => {
  const { colors } = useTheme();
  const flatListRef = useRef<FlatList>(null);

  const dates = useMemo(() => {
    const arr = [];
    const today = startOfDay(new Date());
    const start = addDays(today, -7); 
    
    for (let i = 0; i < 60; i++) {
      arr.push(addDays(start, i));
    }
    return arr;
  }, []); 

  useEffect(() => {
    if (!selectedDate || !flatListRef.current) return;

    const index = dates.findIndex(d => isSameDay(d, selectedDate));
    
    if (index !== -1) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5 
      });
    }
  }, [selectedDate, dates]);

  const renderItem = useCallback(({ item }: { item: Date }) => {
    return (
      <DateStripItem 
        item={item} 
        isSelected={isSameDay(item, selectedDate)} 
        onSelect={onSelectDate} 
        colors={colors}
      />
    );
  }, [selectedDate, onSelectDate, colors]);

  const getItemLayout = (_: any, index: number) => ({
    length: 70, 
    offset: 70 * index,
    index,
  });

  return (
    <View className="flex-row items-center bg-background-light dark:bg-background-dark py-4 z-10">
      <View className="flex-1">
        <FlatList
          ref={flatListRef}
          data={dates}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.toISOString()}
          contentContainerStyle={{ paddingHorizontal: 16 }} 
          renderItem={renderItem}
          getItemLayout={getItemLayout} 
          initialNumToRender={10}
        />
      </View>

      <View className="pl-2 pr-4">
        <TouchableOpacity
          onPress={onCalendarPress}
          className="items-center justify-center rounded-2xl w-[58px] h-[72px] bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark"
        >
          <MaterialIcons name="event" size={26} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};