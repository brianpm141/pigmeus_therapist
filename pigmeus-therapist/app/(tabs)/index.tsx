import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { FloatingButton, SegmentedControl } from '@/components/ui/UIComponents';

export default function AgendaScreen() {

  const [ sexo , setSexo ] = useState('');

  const handleAddConsultation = () => {
    console.log('Añadir consulta');
  }

  return (
    <View className="flex-1 justify-center items-center bg-background-light dark:bg-background-dark">
      <Text className="text-2xl font-bold text-primary">Agenda</Text>
      <Text className="text-text-secondary-dark mt-2">Calendario de citas siguientes</Text>

      <Text>{sexo} </Text>

      <FloatingButton onPress={handleAddConsultation} iconName="add" />
    </View>
  );
}