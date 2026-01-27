import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '@/core/ThemeContext';

interface Option {
  label: string;
  value: string;
}

interface SegmentedControlProps {
  label?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

export const SegmentedControl = ({ label, options, value, onChange }: SegmentedControlProps) => {
  const { colors } = useTheme(); // Obtener colores dinámicos del tema

  // Generar colores con opacidad basados en el color primario del tema
  const LIGHT_BG = colors.soft; // Fondo suave del track (ya viene del tema)
  const SELECTED_BORDER = `${colors.primary}40`; // Borde sutil para el item seleccionado

  return (
    <View className="mb-4 w-full">
      {label && (
        <Text className="text-text-secondary dark:text-text-inverse-secondary font-medium mb-2 text-xs uppercase tracking-widest">
          {label}
        </Text>
      )}

      <View
        className="flex-row p-1.5 rounded-2xl h-14 items-center"
        style={{ backgroundColor: LIGHT_BG }}
      >
        {options.map((option) => {
          const isSelected = option.value === value;

          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              className="flex-1 h-full items-center justify-center rounded-xl"
              style={{
                backgroundColor: isSelected ? '#ffffff' : 'transparent',
                borderWidth: isSelected ? 1 : 0,
                borderColor: SELECTED_BORDER,
                shadowColor: colors.primary, // Shadow dinámico basado en el tema
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isSelected ? 0.05 : 0,
                shadowRadius: 4,
                elevation: isSelected ? 1 : 0,
              }}
            >
              <Text
                className={`font-sans text-sm ${isSelected
                  ? 'text-primary font-bold'
                  : 'text-text-secondary dark:text-text-inverse-tertiary font-medium opacity-70'
                  }`}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};