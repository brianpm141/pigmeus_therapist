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

interface DatePickerProps {
  label?: string;
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  error?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  disabled?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Seleccionar fecha',
  error,
  minimumDate,
  maximumDate,
  disabled = false,
}) => {
  const [show, setShow] = useState(false);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Manejador unificado
  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // En Android, el picker se cierra al seleccionar
    if (Platform.OS === 'android') {
      setShow(false);
    }
    
    if (event.type === 'set' && selectedDate) {
      onChange(selectedDate);
    }
  };

  // Renderizado del texto a mostrar
  const displayValue = value 
    ? format(value, 'dd/MM/yyyy', { locale: es })
    : placeholder;

  const textColorClass = value 
    ? 'text-text-primary dark:text-text-inverse' 
    : 'text-text-secondary';

  const borderColorClass = error 
    ? 'border-status-danger' 
    : 'border-border-light dark:border-border-dark';

  return (
    <View className="w-full mb-4">
      {/* Label */}
      {label && (
        <Text className="text-text-primary dark:text-text-inverse font-bold mb-2 text-sm ml-1">
          {label}
        </Text>
      )}

      {/* Trigger (Input falso) */}
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
        name="calendar" 
        size={20} 
        color={isDark ? '#e2e8f0' : '#64748b'} 
        />
      </Pressable>

      {/* Mensaje de Error */}
      {error && (
        <Text className="text-status-danger text-xs mt-1 ml-1 font-medium">
          {error}
        </Text>
      )}

      {/* Lógica de Selección */}
      
      {/* ANDROID */}
      {Platform.OS === 'android' && show && (
        <RNDateTimePicker
          value={value || new Date()}
          mode="date"
          display="default"
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}

      {/* iOS */}
      {Platform.OS === 'ios' && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={show}
          onRequestClose={() => setShow(false)}
        >
          <View className="flex-1 justify-end bg-black/40">
            {/* Contenedor del Picker iOS */}
            <View className="bg-surface-light dark:bg-surface-dark pb-safe">
              
              {/* Toolbar con botón "Listo" */}
              <View className="flex-row justify-end px-4 py-3 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-darker rounded-t-2xl">
                <Pressable onPress={() => setShow(false)} className="p-2">
                  <Text className="text-primary font-bold text-lg">Listo</Text>
                </Pressable>
              </View>

              {/* Picker */}
              <RNDateTimePicker
                value={value || new Date()}
                mode="date"
                display="spinner"
                onChange={handleChange}
                textColor={isDark ? '#fff' : '#000'}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                style={{ height: 200 }} // Altura fija necesaria en iOS a veces
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};