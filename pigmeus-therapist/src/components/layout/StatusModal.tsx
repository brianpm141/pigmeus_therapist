import React from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

// Definimos los tipos de modales posibles
type ModalType = 'info' | 'error' | 'warning' | 'delete';

interface StatusModalProps {
  isVisible: boolean;
  type: ModalType;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export const StatusModal = ({
  isVisible,
  type,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel,
  cancelLabel
}: StatusModalProps) => {
  const { t } = useTranslation();

  const config = {
    info: {
      icon: 'info',
      color: '#13c8ec', // Tu azul primary
      bgIcon: 'bg-cyan-100',
    },
    error: {
      icon: 'error-outline',
      color: '#ef4444', // status.danger
      bgIcon: 'bg-red-100',
    },
    warning: {
      icon: 'warning',
      color: '#fb923c', // status.warning
      bgIcon: 'bg-orange-100',
    },
    delete: {
      icon: 'delete-outline',
      color: '#ef4444',
      bgIcon: 'bg-red-100',
    }
  };

  const currentConfig = config[type];

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50 px-6">
        <View className="bg-white dark:bg-surface-dark w-full rounded-[30px] p-8 items-center shadow-xl">
          
          {/* Indicador superior (la barrita gris de tus imágenes) */}
          <View className="w-12 h-1 bg-gray-200 rounded-full mb-6" />

          {/* Icono Circular */}
          <View className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${currentConfig.bgIcon}`}>
            <MaterialIcons name={currentConfig.icon as any} size={32} color={currentConfig.color} />
          </View>

          {/* Texto de Información */}
          <Text className="text-xl font-extrabold text-text-primary dark:text-text-inverse text-center mb-2">
            {title}
          </Text>
          <Text className="text-sm font-medium text-text-secondary text-center mb-8 leading-5">
            {message}
          </Text>

          {/* Botones Dinámicos */}
          <View className="w-full gap-y-3">
            <Pressable 
              onPress={onConfirm}
              className="w-full h-14 rounded-2xl items-center justify-center"
              style={{ backgroundColor: currentConfig.color }}
            >
              <Text className="text-white font-bold text-base">
                {confirmLabel || t('actions.continue')}
              </Text>
            </Pressable>

            {onCancel && (
              <Pressable 
                onPress={onCancel}
                className="w-full h-14 rounded-2xl items-center justify-center bg-gray-100 dark:bg-surface-darker"
              >
                <Text className="text-text-primary dark:text-text-inverse font-bold text-base">
                  {cancelLabel || t('actions.cancel')}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};