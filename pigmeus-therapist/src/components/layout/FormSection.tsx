import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';

const BLUE_PRIMARY = "#13c8ec";

interface FormSectionProps {
  titleKey: string;
  children: React.ReactNode;
  iconName?: React.ComponentProps<typeof MaterialIcons>['name']; 
}

export const FormSection = ({ titleKey, children, iconName }: FormSectionProps) => {
  const { t } = useTranslation();

  return (
    <View className="mb-8 w-full">

      <View className="flex-row items-center mb-4">
        {iconName && (
          <View className="mr-2">
            <MaterialIcons 
              name={iconName} 
              size={20} 
              color={BLUE_PRIMARY}
              className="text-primary dark:text-primary-light mx-2" 
            />
          </View>
        )}
        
        <Text className="text-lg font-extrabold text-text-primary dark:text-text-inverse">
          {t(titleKey)}
        </Text>
      </View>
      
      {/* Contenedor de los Inputs */}
      <View className='flex gap-1 p-3 bg-background-light dark:bg-background-dark
      rounded-lg border border-border-light dark:border-border-dark'>
        {children}
      </View>
    </View>
  );
};