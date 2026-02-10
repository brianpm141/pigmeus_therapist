import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  Platform, 
  Modal, 
} from 'react-native';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useColorScheme } from 'nativewind';
import { Feather } from '@expo/vector-icons';

// 1. Interfaz actualizada con minuteInterval
interface DatePickerProps {
  label?: string; 
  value?: Date; 
  onChange: (date: Date) => void; 
  placeholder?: string; 
  error?: string; 
  minimumDate?: Date; 
  maximumDate?: Date; 
  disabled?: boolean; 
  mode?: 'date' | 'time'; 
  // Definimos los intervalos permitidos por el componente nativo
  minuteInterval?: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  minimumDate,
  maximumDate,
  disabled = false,
  mode = 'date',
  minuteInterval, // 2. Desestructuramos la nueva prop
}) => {
  const [show, setShow] = useState(false);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    
    if (event.type === 'set' && selectedDate) {
      onChange(selectedDate);
    }
  };

  const formatString = mode === 'date' ? 'dd/MM/yyyy' : 'hh:mm a';
  const defaultPlaceholder = mode === 'date' ? 'Seleccionar fecha' : 'Seleccionar hora';
  
  const displayValue = value 
    ? format(value, formatString, { locale: es })
    : placeholder || defaultPlaceholder;

  const textColorClass = value 
    ? 'text-text-primary dark:text-text-inverse' 
    : 'text-text-secondary';

  const borderColorClass = error 
    ? 'border-status-danger' 
    : 'border-border-light dark:border-border-dark';

  return (
    <View className="w-full mb-4">
      {label && (
        <Text className="text-text-primary dark:text-text-inverse font-bold mb-2 text-sm ml-1 font-sans">
          {label}
        </Text>
      )}

      <Pressable
        onPress={() => !disabled && setShow(true)}
        className={`
          flex-row items-center justify-between
          h-14 px-4 rounded-xl border
          bg-surface-light dark:bg-surface-dark
          ${borderColorClass}
          ${disabled ? 'opacity-50' : 'opacity-100'}
        `}
      >
        <Text className={`font-medium text-base ${textColorClass}`}>
          {displayValue}
        </Text>
        
        <Feather 
          name={mode === 'date' ? "calendar" : "clock"} 
          size={20} 
          color={isDark ? '#e2e8f0' : '#64748b'} 
        />
      </Pressable>

      {error && (
        <Text className="text-status-danger text-xs mt-1 ml-1 font-medium">
          {error}
        </Text>
      )}

      {/* SELECTOR NATIVO ANDROID */}
      {Platform.OS === 'android' && show && (
        <RNDateTimePicker
          value={value || new Date()}
          mode={mode}
          display="default"
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          is24Hour={false}
          minuteInterval={minuteInterval} // 3. Pasamos la prop a Android
        />
      )}

      {/* SELECTOR MODAL iOS */}
      {Platform.OS === 'ios' && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={show}
          onRequestClose={() => setShow(false)}
        >
          <View className="flex-1 justify-end bg-black/40">
            <View className="bg-surface-light dark:bg-surface-dark pb-safe rounded-t-3xl">
              
              <View className="flex-row justify-end px-4 py-3 border-b border-border-light dark:border-border-dark">
                <Pressable onPress={() => setShow(false)} className="p-2">
                  <Text className="text-primary font-bold text-lg">Listo</Text>
                </Pressable>
              </View>

              <RNDateTimePicker
                value={value || new Date()}
                mode={mode}
                display="spinner"
                onChange={handleChange}
                textColor={isDark ? '#ffffff' : '#0f172a'}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                style={{ height: 220 }}
                minuteInterval={minuteInterval} 
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};