import { View, Text } from 'react-native';

export default function ConsultationsScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-background-light dark:bg-background-dark">
      <Text className="text-2xl font-bold text-primary">Historial de Consultas</Text>
      <Text className="text-text-secondary-dark mt-2">Gestión clínica y notas médicas</Text>
    </View>
  );
}