import { View, Text } from 'react-native';
import { FloatingButton } from '@/components/ui/FloatingButton';

export default function ConsultationsScreen() {

  const handleAddConsultation = () => {
    console.log('Añadir consulta');
  }

  return (
    <View className="flex-1 justify-center items-center bg-background-light dark:bg-background-dark">
      <Text className="text-2xl font-bold text-primary">Historial de Consultas</Text>
      <Text className="text-text-secondary-dark mt-2">Gestión clínica y notas médicas</Text>
      <FloatingButton onPress={handleAddConsultation} iconName="add" />
    </View>
  );
}