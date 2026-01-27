import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    className?: string;
}

export const Input = ({ label, error, className, ...props }: InputProps) => {
    return (
        <View className="mb-4 w-full">

            {label && (
                <Text className="text-text-primary dark:text-text-inverse font-sans font-medium mb-2 text-base">
                    {label}
                </Text>
            )}

            <TextInput
                placeholderTextColor="#9CA3AF"
                className={`
                w-full
                bg-surface-light dark:bg-surface-dark
                text-text-primary dark:text-text-inverse
                rounded-xl
                px-4 py-3
                font-sans
                text-base
                border-transparent
                ${error ? 'border border-status-danger' : 'border border-border-light focus:border-primary'}
                ${className || ''}
                `}
                {...props}
            />

            {/* Mostrar mensaje de error si existe */}
            {error && (
                <Text className="text-status-danger font-sans text-sm mt-1">
                    {error}
                </Text>
            )}

        </View>
    )
}