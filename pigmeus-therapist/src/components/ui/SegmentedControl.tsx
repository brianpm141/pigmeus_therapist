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
  return (
    <View className="mb-4 w-full">
      {label && (
        <Text className="text-text-primary font-sans font-medium mb-2 text-base">
          {label}
        </Text>
      )}

      {/* Track Container */}
      <View className="flex-row bg-slate-100 p-1 rounded-xl h-14 items-center">
        {options.map((option) => {
          const isSelected = option.value === value;
          
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              // 1. CLASES ESTÁTICAS (Estructura que nunca cambia)
              className="flex-1 h-full items-center justify-center rounded-lg"
              // 2. ESTILOS DINÁMICOS (Bypasseamos NativeWind para el estado crítico)
              style={{
                backgroundColor: isSelected ? '#ffffff' : 'transparent',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: isSelected ? 0.1 : 0,
                shadowRadius: 2,
                elevation: isSelected ? 2 : 0, // Sombra para Android
              }}
            >
              <Text 
                // Aquí el texto suele ser menos problemático, podemos dejar className
                className={`
                  font-sans text-base
                  ${isSelected ? 'text-primary font-bold' : 'text-text-secondary font-medium'}
                `}
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