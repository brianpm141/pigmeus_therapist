import React from 'react';
import { 
    Modal, 
    View, 
    KeyboardAvoidingView, 
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    Text,
    Pressable
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const BLUE_PRIMARY = "#13c8ec";

interface Props {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
    iconName?: React.ComponentProps<typeof MaterialIcons>['name'];
}

export const FloatingFormContainer = ({ visible, onClose, children, title, iconName }: Props) => {
    return (
        <Modal
        animationType="fade" // Entra suavemente desde abajo
        transparent={true}
        visible={visible}
        onRequestClose={onClose} // botón atras en android
        >

    <View className="flex-1 bg-black/70 justify-center p-5">
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1 justify-center"
        >
          {/* tarjeta flotante */}
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View 
              className="bg-surface-light dark:bg-surface-dark rounded-[24px] overflow-hidden shadow-2xl max-h-[90%]"
            >
              {/* header de la ventana */}
                <View className="flex-row justify-between items-center px-4 py-4 border-b border-border-light dark:border-border-dark">
                    <View className="w-10" />

                    {/* 2. Título dinámico (puedes pasarle una prop 'title' si gustas) */}
                    <View className="flex-1 items-center">
                        
                        <View className="flex-row items-center mb-0">
                            {iconName && (
                                  <View className="mr-2">
                                    <MaterialIcons 
                                      name={iconName} 
                                      size={26} 
                                      color={BLUE_PRIMARY}
                                      className="text-primary dark:text-primary-light mx-2" 
                                    />
                                  </View>
                                )}

                        <Text className="text-lg font-bold text-text-primary dark:text-text-inverse">
                            {title}
                        </Text>
                        </View>
                        
                    </View>

                    <Pressable 
                    onPress={onClose}
                    className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-surface-darker">
                        <Text className="text-xl font-medium text-text-secondary">✕</Text>
                    </Pressable>
                </View>

              {/* Contenedor con Scroll para el contenido largo */}
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ padding: 20 }}
                >
                {children}
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    </View>
    </Modal>
    );
};