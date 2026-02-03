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
  label?: string; // Texto descriptivo encima del campo [cite: 156]
  value?: Date; // Objeto fecha/hora seleccionado [cite: 156]
  onChange: (date: Date) => void; // Callback al confirmar [cite: 156]
  placeholder?: string; // Texto si no hay selección [cite: 156]
  error?: string; // Mensaje de error (borde rojo) [cite: 156]
  minimumDate?: Date; // Fecha mínima [cite: 156]
  maximumDate?: Date; // Fecha máxima [cite: 156]
  disabled?: boolean; // Deshabilita interacción [cite: 156]
  mode?: 'date' | 'time'; // Define si es calendario o reloj
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
  mode = 'date', // Por defecto actúa como selector de fecha [cite: 147]
}) => {
  const [show, setShow] = useState(false);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Manejador para cerrar y procesar el cambio
  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // En Android, el picker se cierra inmediatamente tras seleccionar [cite: 150]
    if (Platform.OS === 'android') {
      setShow(false);
    }
    
    // Solo actualizamos si el usuario presionó "Aceptar" (set)
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
      {/* Etiqueta de campo [cite: 151] */}
      {label && (
        <Text className="text-text-primary dark:text-text-inverse font-bold mb-2 text-sm ml-1 font-sans">
          {label}
        </Text>
      )}

      {/* Disparador del selector (Trigger) [cite: 151] */}
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
        
        {/* Icono dinámico: Calendario para fecha, Reloj para hora */}
        <Feather 
          name={mode === 'date' ? "calendar" : "clock"} 
          size={20} 
          color={isDark ? '#e2e8f0' : '#64748b'} 
        />
      </Pressable>

      {/* Mensaje de validación [cite: 154] */}
      {error && (
        <Text className="text-status-danger text-xs mt-1 ml-1 font-medium">
          {error}
        </Text>
      )}

      {/* SELECTOR NATIVO ANDROID [cite: 150] */}
      {Platform.OS === 'android' && show && (
        <RNDateTimePicker
          value={value || new Date()}
          mode={mode}
          display="default"
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          is24Hour={false}
        />
      )}

      {/* SELECTOR MODAL iOS (Estilo Spinner) [cite: 150] */}
      {Platform.OS === 'ios' && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={show}
          onRequestClose={() => setShow(false)}
        >
          <View className="flex-1 justify-end bg-black/40">
            <View className="bg-surface-light dark:bg-surface-dark pb-safe rounded-t-3xl">
              
              {/* Barra de herramientas iOS */}
              <View className="flex-row justify-end px-4 py-3 border-b border-border-light dark:border-border-dark">
                <Pressable onPress={() => setShow(false)} className="p-2">
                  <Text className="text-primary font-bold text-lg">Listo</Text>
                </Pressable>
              </View>

              {/* Picker con soporte de tema oscuro [cite: 153] */}
              <RNDateTimePicker
                value={value || new Date()}
                mode={mode}
                display="spinner"
                onChange={handleChange}
                textColor={isDark ? '#ffffff' : '#0f172a'}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                style={{ height: 220 }}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};