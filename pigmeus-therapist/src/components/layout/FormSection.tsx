import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/core/ThemeContext';

interface FormSectionProps {
  titleKey: string;
  children: React.ReactNode;
  iconName?: React.ComponentProps<typeof MaterialIcons>['name'];
}

export const FormSection = ({ titleKey, children, iconName }: FormSectionProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme(); 

  return (
    <View className="mb-8 w-full">

      <View className="flex-row items-center mb-4">
        {iconName && (
          <View className="mr-2 p-1.5 rounded-full ">
            <MaterialIcons
              name={iconName}
              size={24}
              color={colors.primary}
            />
          </View>
        )}

        <Text className="text-lg font-extrabold text-text-primary dark:text-text-inverse">
          {t(titleKey)}
        </Text>
      </View>

      {/* Contenedor de los Inputs */}
      <View className='flex gap-1 p-5 bg-background-light dark:bg-background-dark
      rounded-2xl'>
        {children}
      </View>
    </View>
  );
};