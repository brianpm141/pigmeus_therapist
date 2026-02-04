import React, { useState } from 'react';
import { View, Text, SectionList, TextInput, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { FloatingButton } from '@/components/ui/FloatingButton'; 
import { StatusModal, FloatingFormContainer } from '@/components/layout/Molecules'; 
import { NewAppointmentForm, AppointmentCard } from '@/features/appointments/components/AppointmentsComponents';
import { useConsultations } from '@/features/appointments/hooks/useConsultations';
import { PatientForm } from '@/features/patients/components/PatientComponets'; 
import { AppointmentDetail } from '@/features/appointments/components/AppointmentDetail'; //
import { ConsultationItem } from '@/types/appointments';

export default function ConsultationsScreen() {
  const { t } = useTranslation();
  
  // Definición de tipos permitidos por StatusModal
  type ModalType = 'info' | 'delete' | 'error' | 'warning'; 

  const { 
    sections, 
    loading, 
    refreshing, 
    onRefresh, 
    searchQuery, 
    setSearchQuery, 
    handleCancel 
  } = useConsultations();

  // --- ESTADOS DE VISIBILIDAD ---
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isPatientFormVisible, setIsPatientFormVisible] = useState(false);
  
  // Nuevo: Estados para Detalle y Edición
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ConsultationItem | null>(null);

  const [statusModal, setStatusModal] = useState<{
    visible: boolean;
    type: ModalType;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  // --- LÓGICA DE DETALLES Y EDICIÓN ---

  const handleOpenDetail = (item: ConsultationItem) => {
    setSelectedItem(item);
    setIsDetailVisible(true);
  };

  const handleEditFromDetail = () => {
    setIsDetailVisible(false); // Cerramos detalle
    // Damos un pequeño delay para la transición del modal
    setTimeout(() => {
      setIsFormVisible(true); // Abrimos formulario (que leerá selectedItem)
    }, 300);
  };

  const handleDeleteFromDetail = () => {
    setIsDetailVisible(false);
    if (selectedItem) {
      setTimeout(() => {
        // Reutilizamos la lógica de confirmación existente
        confirmCancel(selectedItem.data.id, selectedItem.type === 'periodic');
      }, 300);
    }
  };

  // Limpieza al cerrar formulario (Vital para que el botón "+" funcione como "Crear")
  const handleCloseForm = () => {
    setIsFormVisible(false);
    setSelectedItem(null);
  };

  // --- LÓGICA DE CANCELACIÓN ---
  const confirmCancel = (id: string, isPattern: boolean) => {
    setStatusModal({
      visible: true,
      type: 'delete',
      title: isPattern ? "¿Eliminar Tratamiento?" : "¿Eliminar Cita?",
      message: isPattern
        ? "Se borrarán permanentemente el patrón y todas las citas asociadas. Esta acción no se puede deshacer."
        : "Se borrará permanentemente esta cita de la base de datos.",
      confirmLabel: isPattern ? "Sí, Eliminar Todo" : "Sí, Borrar",
      cancelLabel: "Cancelar",
      onConfirm: () => {
         handleCancel(id, isPattern);
         setStatusModal(prev => ({...prev, visible: false}));
         setSelectedItem(null); // Limpiamos selección si se borró desde detalle
      },
      onCancel: () => setStatusModal(prev => ({...prev, visible: false}))
    });
  };

  // --- LÓGICA DE NUEVA/EDITAR CITA ---
  const handleAppointmentSuccess = () => {
    setIsFormVisible(false); 
    setSelectedItem(null); // Limpiamos selección
    onRefresh(); 
    
    setTimeout(() => {
        setStatusModal({
            visible: true,
            type: 'info', 
            title: t('info.success'), 
            message: selectedItem ? "Consulta actualizada correctamente." : "La consulta se ha programado correctamente.",
            confirmLabel: t('actions.confirm'),
            onConfirm: () => setStatusModal(prev => ({...prev, visible: false}))
        });
    }, 400);
  };

  // --- LÓGICA DE NUEVO PACIENTE ---
  const handleOpenPatientForm = () => {
    setIsFormVisible(false); 
    // No limpiamos selectedItem aquí para que al volver se mantenga el estado si estábamos editando
    setTimeout(() => setIsPatientFormVisible(true), 300); 
  };

  const handlePatientSaveSuccess = () => {
    setIsPatientFormVisible(false); 
    
    setTimeout(() => {
         setStatusModal({
            visible: true,
            type: 'info',
            title: t('info.successSavePacient'),
            message: "Paciente registrado. Ahora puedes seleccionarlo.",
            confirmLabel: "Continuar con la Cita",
            onConfirm: () => {
                setStatusModal(prev => ({...prev, visible: false}));
                setIsFormVisible(true); 
            }
        });
    }, 400);
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark px-7">
      
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator className="text-primary" size="large" />
        </View>
      ) : (
        <>
          {/* Header */}
          <View className="flex-row items-center justify-between my-3">
            <Text className="text-2xl font-extrabold text-text-primary dark:text-text-inverse">
              {t('common.pacientName', 'Consultas')}
            </Text>
          </View>
        
          {/* Buscador */}
          <View className="bg-surface-light dark:bg-surface-dark rounded-full h-12 flex-row items-center px-4 mb-2 shadow-sm border border-border-light dark:border-border-dark">
            <Feather name="search" size={20} color="#94a3b8" />
            <TextInput
              className="flex-1 ml-2 text-text-primary dark:text-text-inverse font-medium"
              placeholder={t('common.search')}
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Feather onPress={() => setSearchQuery('')} name="x" size={18} color="#94a3b8" />
            )}
          </View>

          {/* Lista de Consultas */}
          <SectionList
            sections={sections}
            keyExtractor={(item) => `${item.type}-${item.data.id}`}
            stickySectionHeadersEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshing={refreshing}
            onRefresh={onRefresh}
            
            renderItem={({ item }) => (
              <AppointmentCard 
                item={item} 
                onPress={() => handleOpenDetail(item)} // Abre detalle al tocar la tarjeta
                onCancel={confirmCancel} // Mantiene botón rápido de cancelar
              />
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
                      ? 'No se encontraron consultas con ese nombre' 
                      : 'No hay consultas programadas.\n¡Añade una nueva!'}
                  </Text>
                </View>
              ) : null
            }
          />

          {/* FAB Principal */}
          <FloatingButton 
            iconName="add" 
            onPress={() => {
                setSelectedItem(null); // Aseguramos que es modo CREAR
                setIsFormVisible(true);
            }} 
          />

          {/* --- DETALLES Y FORMULARIOS --- */}
          
          {/* 1. Detalle de Consulta */}
          <AppointmentDetail
            visible={isDetailVisible}
            item={selectedItem}
            onClose={() => setIsDetailVisible(false)}
            onEdit={handleEditFromDetail}
            onDelete={handleDeleteFromDetail}
          />

          {/* 2. Formulario de Cita (Crear/Editar) */}
          <NewAppointmentForm
            visible={isFormVisible}
            onClose={handleCloseForm} // Usamos el handler que limpia selección
            onSuccess={handleAppointmentSuccess} 
            onOpenPatientForm={handleOpenPatientForm}
            initialData={selectedItem} // Pasamos datos si estamos editando
          />

          {/* 3. Formulario de Paciente */}
          <FloatingFormContainer
             visible={isPatientFormVisible}
             onClose={() => {
                setIsPatientFormVisible(false);
                setIsFormVisible(true); 
             }}
             title={t('FormPatient.addPatient')}
             iconName="person-add"
          >
             <PatientForm 
                onSuccess={handlePatientSaveSuccess}
             />
          </FloatingFormContainer>

          {/* --- MODAL DE ESTADO --- */}
          <StatusModal
            isVisible={statusModal.visible}
            type={statusModal.type}
            title={statusModal.title}
            message={statusModal.message}
            confirmLabel={statusModal.confirmLabel}
            cancelLabel={statusModal.cancelLabel}
            onConfirm={statusModal.onConfirm || (() => setStatusModal(prev => ({...prev, visible: false})))}
            onCancel={statusModal.onCancel} 
          />
        </>
      )}
    </View>
  );
}