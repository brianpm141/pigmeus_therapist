import { View, Text } from 'react-native';

interface StatCardProps {
  label: string;
  value: number | string;
  subtext?: string;
  subtextColor?: string;
}

export const StatCard = ({ label, value, subtext, subtextColor = 'text-status-success' }: StatCardProps) => (
  <View className="flex-1 bg-background-light dark:bg-background-dark p-4 rounded-2xl ">
    <Text className="text-text-secondary font-medium text-xs mb-1">{label}</Text>
    <View className="flex-row items-baseline">
      <Text className="text-2xl font-extrabold text-text-primary dark:text-text-inverse">{value}</Text>
      {subtext && (
        <Text className={`text-[10px] font-bold ml-2 ${subtextColor}`}>
          {subtext}
        </Text>
      )}
    </View>
  </View>
);