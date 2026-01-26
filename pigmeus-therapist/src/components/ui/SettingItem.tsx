import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SettingItemProps {
  iconName: React.ComponentProps<typeof MaterialIcons>['name'];
  title: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode; 
}

export const SettingItem = ({ iconName, title, value, onPress, rightElement }: SettingItemProps) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center justify-between py-4 border-b border-border-light dark:border-border-dark"
    >
      <View className="flex-row items-center">
        <View className="w-10 h-10 bg-status-info-soft rounded-xl items-center justify-center mr-4">
          <MaterialIcons name={iconName} size={22} color="#13c8ec" />
        </View>
        <Text className="text-text-primary dark:text-text-inverse font-medium text-base">
          {title}
        </Text>
      </View>

      <View className="flex-row items-center">
        {value && <Text className="text-text-secondary mr-2">{value}</Text>}
        {rightElement || <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />}
      </View>
    </TouchableOpacity>
  );
};