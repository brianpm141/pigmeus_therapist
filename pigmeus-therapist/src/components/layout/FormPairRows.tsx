import React from 'react';
import { View } from 'react-native';

interface FormPairRowsProps {
  children: [React.ReactNode, React.ReactNode]; // Forzamos exactamente 2 hijos
}

export const FormPairRows = ({ children }: FormPairRowsProps) => {
  return (
    <View className="flex-row justify-between w-full mb-4">
      <View className="flex-1 mr-2">
        {children[0]}
      </View>
      <View className="flex-1 ml-2">
        {children[1]}
      </View>
    </View>
  );
};