import { View, Text } from 'react-native';

export default function AgendaScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-background-light dark:bg-background-dark">
      <Text className="text-2xl font-bold text-primary">Pantalla de Agenda</Text>
      <Text className="text-text-secondary-dark mt-2">Calendario próximamente...</Text>
    </View>
  );
}