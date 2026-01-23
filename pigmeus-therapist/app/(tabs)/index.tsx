import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { FloatingButton } from '@/components/ui/UIComponents';
import { StatusModal } from '@/components/layout/Molecules';

export default function AgendaScreen() {

const [showError, setShowError] = useState<boolean>(false)

const onPress = () => (setShowError(true))

const onConfirm = () => (setShowError(false)) 
const onCancel = () => (setShowError(false))

  return (
    <View className="flex-1 justify-center items-center bg-background-light dark:bg-background-dark">
      
      <Text className="text-2xl font-bold text-primary">Agenda</Text>
      <Text className="text-text-secondary-dark mt-2">Calendario de citas siguientes</Text>

      <FloatingButton onPress= {onPress} iconName="add" />
    </View>
  );
}