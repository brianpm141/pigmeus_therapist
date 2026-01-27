import React from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';

interface TextAreaProps extends TextInputProps {
  label?: string; // Opcional: Si queremos pasarle un título simple
  error?: string; // Opcional: Para mostrar mensajes de validación}
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  className,
  ...props
}) => {
  return (
    <View className="w-full mb-4">
      {/* Label (si existe) */}
      {label && (
        <Text className="text-text-primary dark:text-text-inverse font-bold font-sans mb-2 text-base">
          {label}
        </Text>
      )}

      {/* Input Area */}
      <TextInput
        className={`
          bg-surface-light dark:bg-surface-dark
          border border-border-light 
          rounded-2xl 
          p-4 
          text-text-primary dark:text-text-inverse
          font-sans 
          text-base 
          min-h-[120px] 
          ${error ? 'border-status-danger' : 'focus:border-primary'}
          ${className}
        `}
        placeholderTextColor="#94a3b8" // text-secondary
        multiline={true}
        textAlignVertical="top" // Crucial para Android: el texto empieza arriba
        {...props}
      />

      {/* Mensaje de Error */}
      {error && (
        <Text className="text-status-danger text-sm mt-1 font-medium">
          {error}
        </Text>
      )}
    </View>
  );
};