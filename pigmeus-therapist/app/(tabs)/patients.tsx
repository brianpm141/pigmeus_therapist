import { View, Text } from 'react-native';
import { FloatingButton } from '@/components/ui/FloatingButton';

export default function PatientsScreen() {

  const handleAddPatient = () => {
    console.log('Añadir paciente');
  }

  return (
    <View className="flex-1 justify-center items-center bg-background-light dark:bg-background-dark">
      <Text className="text-2xl font-bold text-primary">Lista de Pacientes</Text>
      <FloatingButton onPress={handleAddPatient} iconName="add" />
    </View>
  );
}