import React from 'react';
import { View, Text, Pressable } from 'react-native';

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
  // Colores basados en tu primary (#13c8ec)
  const PRIMARY_COLOR = '#13c8ec';
  const LIGHT_BLUE_BG = '#13c8ec08'; // Muy suave para el fondo del "track"
  const SELECTED_BORDER = '#13c8ec40'; // Borde sutil para el item seleccionado

  return (
    <View className="mb-4 w-full">
      {label && (
        <Text className="text-text-secondary dark:text-text-inverse-secondary font-medium mb-2 text-xs uppercase tracking-widest">
          {label}
        </Text>
      )}

      {/* Track Container: Fondo azul muy clarito */}
      <View
        className="flex-row p-1.5 rounded-2xl h-14 items-center"
        style={{ backgroundColor: LIGHT_BLUE_BG }}
      >
        {options.map((option) => {
          const isSelected = option.value === value;

          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              className="flex-1 h-full items-center justify-center rounded-xl"
              style={{
                // El seleccionado es blanco puro con un borde cian muy suave
                backgroundColor: isSelected ? '#ffffff' : 'transparent',
                borderWidth: isSelected ? 1 : 0,
                borderColor: SELECTED_BORDER,
                // Sombras suaves solo para el seleccionado
                shadowColor: PRIMARY_COLOR,
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