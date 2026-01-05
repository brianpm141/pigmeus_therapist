import { View, Text } from 'react-native';

export default function PatientsScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-background-light dark:bg-background-dark">
      <Text className="text-2xl font-bold text-primary">Lista de Pacientes</Text>
    </View>
  );
}