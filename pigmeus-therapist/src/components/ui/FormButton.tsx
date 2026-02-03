import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MaterialIcons } from '@expo/vector-icons';


// Pequeña utilidad para mezclar clases de Tailwind sin conflictos
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  iconName?: React.ComponentProps<typeof MaterialIcons>['name']; // Tipado estricto de nombres de iconos
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const FormButton = ({
  title,
  onPress,
  variant = 'primary',
  iconName = undefined,
  isLoading = false,
  disabled = false,
  className,
}: ButtonProps) => {

  // Definición de variantes visuales
  const variants = {
    primary: "bg-primary border border-primary", // #13c8ec
    outline: "bg-transparent border-2 border-primary",
    ghost: "bg-transparent border-transparent",
    danger: "bg-status-danger border-status-danger",
  };

  const textStyles = {
    primary: "text-white",
    outline: "text-primary",
    ghost: "text-text-secondary dark:text-text-inverse-secondary",
    danger: "text-white",
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      className={cn(
        "flex-row items-center justify-center my-3 py-4 px-6 rounded-2xl w-full",
        variants[variant],
        (disabled || isLoading) && "opacity-50",
        className
      )}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' ? '#13c8ec' : '#ffffff'} />
      ) : (
        <>

          {iconName && (
            <View className="mr-2">
              <MaterialIcons
                name={iconName}
                size={22}
                className="text-primary dark:text-primary-light"
              />
            </View>
          )}


          <Text className={cn("text-lg font-bold font-manrope text-center", textStyles[variant])}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};