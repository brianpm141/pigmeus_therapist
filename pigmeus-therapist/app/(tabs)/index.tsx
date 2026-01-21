import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { TextArea, FloatingButton, FormButton} from '@/components/ui/UIComponents';

export default function AgendaScreen() {

  const [ texto , setTexto ] = useState ('');

  const handleAddConsultation = () => {
    console.log('Añadir consulta');
  }

  const handleSave = () => {
    console.log('Guardar texto:', texto);
  }

  return (
    <View className="flex-1 justify-center items-center bg-background-light dark:bg-background-dark">
      <Text className="text-2xl font-bold text-primary">Agenda</Text>
      <Text className="text-text-secondary-dark mt-2">Calendario de citas siguientes</Text>

      <TextArea 
        label='Texto'
        placeholder='Ingresa texto aqui...'
        value={texto}
        onChangeText={setTexto}
      />

      <Text>{texto}</Text>

      <FormButton 
        title="Guardar Texto"
        onPress={handleSave}
      />

      

      <FloatingButton onPress={handleAddConsultation} iconName="add" />
    </View>
  );
}