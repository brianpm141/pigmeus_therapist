import React, { useState } from 'react';
import { View, Text, SectionList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { FloatingButton } from '@/components/ui/FloatingButton'; 
import { StatusModal } from '@/components/layout/StatusModal'; 
import { NewAppointmentForm, AppointmentCard } from '@/features/appointments/components/AppointmentsComponents';
import { useConsultations } from '@/features/appointments/hooks/useConsultations';

export default function ConsultationsScreen() {
  const { t } = useTranslation();
  
  // 1. Hook Inteligente
  const { 
    sections, 
    loading, 
    refreshing, 
    onRefresh, 
    searchQuery, 
    setSearchQuery, 
    handleCancel 
  } = useConsultations();

  // 2. Estado para el Formulario
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  // 3. Estado para el Modal de Cancelación (CORREGIDO)
  // Necesitamos saber si es patrón para mostrar el mensaje correcto y llamar a la función adecuada
  const [cancelModal, setCancelModal] = useState<{ 
    visible: boolean; 
    id: string | null; 
    isPattern: boolean; // <--- AGREGADO
  }>({
    visible: false,
    id: null,
    isPattern: false
  });

  // Abre el modal recibiendo los dos parámetros desde la Card
  const confirmCancel = (id: string, isPattern: boolean) => {
    setCancelModal({ visible: true, id, isPattern });
  };

  // Ejecuta la cancelación real pasando los datos al hook
  const executeCancel = () => {
    if (cancelModal.id) {
      handleCancel(cancelModal.id, cancelModal.isPattern); // <--- CORREGIDO
      setCancelModal({ visible: false, id: null, isPattern: false });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <View className="flex-1 px-4 pt-2">
        
        <View className="bg-surface-light dark:bg-surface-dark rounded-full h-12 flex-row items-center px-4 mb-6 shadow-sm border border-border-light dark:border-border-dark">
          <Feather name="search" size={20} color="#94a3b8" />
          <TextInput
            className="flex-1 ml-2 text-text-primary dark:text-text-inverse font-medium"
            placeholder={t('common.search', 'Buscar paciente...')}
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Feather onPress={() => setSearchQuery('')} name="x" size={18} color="#94a3b8" />
          )}
        </View>

        <SectionList
          sections={sections}
          keyExtractor={(item) => `${item.type}-${item.data.id}`}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshing={refreshing}
          onRefresh={onRefresh}
          
          renderItem={({ item }) => (
            <AppointmentCard item={item} onCancel={confirmCancel} />
          )}
          
          renderSectionHeader={({ section: { title, data } }) => (
            <View className="flex-row justify-between items-end mb-4 mt-2">
              <Text className="text-text-primary dark:text-text-inverse font-bold text-lg font-sans">
                {title}
              </Text>
              <View className="bg-primary/10 px-2 py-1 rounded-md">
                <Text className="text-primary text-xs font-bold uppercase">
                  {data.length} {data.length === 1 ? 'Cita' : 'Citas'}
                </Text>
              </View>
            </View>
          )}
          
          ListEmptyComponent={
            !loading ? (
              <View className="items-center justify-center mt-20 opacity-50">
                <Feather name="calendar" size={48} color="#94a3b8" />
                <Text className="text-text-secondary mt-4 font-medium text-center">
                  {searchQuery 
                    ? 'No se encontraron pacientes con ese nombre' 
                    : 'No hay consultas programadas.\n¡Añade una nueva!'}
                </Text>
              </View>
            ) : null
          }
        />

        <FloatingButton 
          iconName="add" 
          onPress={() => setIsFormVisible(true)} 
        />

        <NewAppointmentForm
          visible={isFormVisible}
          onClose={() => setIsFormVisible(false)}
          onSuccess={onRefresh}
        />

        <StatusModal
          isVisible={cancelModal.visible}
          type="delete" // Mantenemos el estilo rojo de peligro
          title={cancelModal.isPattern ? "¿Eliminar Tratamiento?" : "¿Eliminar Cita?"}
          
          message={cancelModal.isPattern
            ? "Se borrarán permanentemente el patrón y todas las citas asociadas. Esta acción no se puede deshacer."
            : "Se borrará permanentemente esta cita de la base de datos."
          }
          confirmLabel={cancelModal.isPattern ? "Sí, Eliminar Todo" : "Sí, Borrar"}
          cancelLabel="Cancelar"
          onConfirm={executeCancel}
          onCancel={() => setCancelModal({ visible: false, id: null, isPattern: false })}
        />
      </View>
    </SafeAreaView>
  );
}