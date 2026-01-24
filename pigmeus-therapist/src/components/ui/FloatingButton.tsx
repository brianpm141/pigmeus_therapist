import React from 'react';
import { TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FloatingButtonProps {
    onPress: () => void;
    iconName?: keyof typeof Ionicons.glyphMap;
}

export const FloatingButton = ({ onPress, iconName = 'add' }: FloatingButtonProps) => {
    return (
        <TouchableOpacity 
            onPress={onPress}
            activeOpacity={0.8}
            className="absolute bottom-6 
            right-6 w-14 h-14 
            bg-primary rounded-full 
            justify-center items-center 
            shadow-lg z-50 elevation-5"
        >
        <Ionicons name={iconName} size={30} color="#083144" />
        </TouchableOpacity>
    );    
};