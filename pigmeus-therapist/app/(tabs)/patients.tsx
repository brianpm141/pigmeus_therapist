import { View, Text, FlatList, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useMemo } from 'react';
import { FloatingButton } from '@/components/ui/FloatingButton';
import { FloatingFormContainer, StatusModal } from '@/components/layout/Molecules';
import { useTranslation } from 'react-i18next';
import { PatientCard, PatientForm, PatientDetail } from '@/features/patients/components/PatientComponets';
import { usePatients } from '@/features/patients/hooks/usePatients';
import { MaterialIcons } from '@expo/vector-icons';
import { Patient } from '@/types/patient';
import { deletePatient } from '@/services/patientService';

export default function PatientsScreen() {

  const insets = useSafeAreaInsets()
  const { t } = useTranslation();
  type ModalType = 'info' | 'delete' | 'error';

 // ---------------------- Gestion de Cards -----------------------

  const { patients, loading } = usePatients('ID_DEL_TERAPEUTA_ACTUAL');
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);


  const filteredPatients = useMemo(() => {
    return patients.filter(p => 
      p.fullName.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, patients]);

  const handleOpenDetail = (patient: Patient) => {
  setSelectedPatient(patient);
  setIsDetailVisible(true);
  };


  // ----------------------- Formulario Registro -------------------------------

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [statusModal, setStatusModal] = useState<{
  visible: boolean;
  type: ModalType;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
    confirmLabel: '',
});

  const handleAddPatient = () => {
    setSelectedPatient(null);
    setIsFormVisible(true);
  }

const handleSaveSucces = (updatedData?: Patient) => {
    setIsFormVisible(false);

    if (selectedPatient && updatedData) {
        setSelectedPatient(updatedData);
        setTimeout(() => {
            setIsDetailVisible(true);
        }, 300);
    } else {
        setSelectedPatient(null);
        setTimeout(() => {
            setStatusModal({
                visible: true,
                type: 'info',
                title: t('info.successSavePacient'),
                message: t('info.successSavePacientMess'),
                confirmLabel: t('actions.confirm'),
            });
        }, 400);
    }
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setTimeout(() => setSelectedPatient(null), 300); 
  };


  //------------------------------------ Edicion de paciente------------------------

  const handleEditFromDetail = () => {
  setIsDetailVisible(false); // Cierra detalles
  setTimeout(() => {
    setIsFormVisible(true);
  }, 300);
};

// -------------------------------------- Eliminacion de Paciente --------------------

  const handleDeleteFromDetail = () => {
  setIsDetailVisible(false);
  setTimeout(() => {
    setStatusModal({
      visible: true,
      type: 'delete',
      title: t('FormPatient.deletePatient'),
      message: t('actions.confirmDeleteMess'),
      confirmLabel: t('actions.delete'),
      cancelLabel: t('actions.cancel'),
      onConfirm: handleConfirmDelete, 
      onCancel: () => {
        setStatusModal(prev => ({ ...prev, visible: false }));
        setTimeout(() => setIsDetailVisible(true), 300); // Reabre detalles al cancelar
      }
    });
  }, 300);
};

  // 2. Función que ejecuta el borrado real
  const handleConfirmDelete = async () => {
  if (!selectedPatient) return;

  try {
    const result = await deletePatient(selectedPatient.id);
    if (result.success) {
      setStatusModal(prev => ({ ...prev, visible: false }));
      
      setTimeout(() => {
        setStatusModal({
          visible: true,
          type: 'info',
          title: t('info.successDeletePacient'),
          message: t('info.successDeletePacientMess'),
          confirmLabel: t('actions.confirm'),
          onConfirm: () => setStatusModal(prev => ({ ...prev, visible: false }))
        });
        setSelectedPatient(null);
      }, 400);
    }
  } catch (error) {
    setStatusModal({
      visible: true,
      type: 'error',
      title: t('info.errorDeletePatient'),
      message: t('info.errorDeleteMessage'),
      confirmLabel: t('actions.confirm'),
      onConfirm: () => setStatusModal(prev => ({ ...prev, visible: false }))
    });
  }
};

  // ----------------------------------- View ---------------------------------------

  return (
    <View 
      className="flex-1 bg-background-light dark:bg-background-dark px-4" // Bajamos px-8 a px-4 para que no sea tan angosto
      style={{ paddingTop: insets.top + 10 }}
    >
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator className="text-primary" size="large" />
        </View>
      ) : (
        <> 
          {/* USAMOS UN FRAGMENT PARA AGRUPAR HERMANOS */}
          
          {/* FILA TÍTULO */}
          <View className="flex-row items-center my-3 justify-between">
            <Text className="text-2xl font-extrabold text-text-primary dark:text-text-inverse">
              {t('common.pacientName')}
            </Text>

            <TouchableOpacity 
              className="bg-surface-light dark:bg-surface-dark p-3 rounded-xl border border-border-light dark:border-border-dark active:bg-primary/10"
              onPress={() => console.log('Filtros')}
            >
              <MaterialIcons name="filter-list" size={24} className="text-primary"/>
            </TouchableOpacity>
          </View>

          {/* BUSCADOR: Quitamos flex-1 para que no colapse */}
          <View className="flex-row items-center bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl px-4 h-12 mb-6">
            <MaterialIcons name="search" size={20} className="text-text-secondary" />
            <TextInput
              className="flex-1 ml-2 text-text-primary dark:text-text-inverse font-sans"
              placeholder={t('common.searchPlaceholder')}
              placeholderTextColor="#94a3b8"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* LISTADO */}
          <FlatList
            className="flex-1 w-full"
            data={filteredPatients}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PatientCard 
                patient={item} 
                onPress={() => handleOpenDetail(item)} 
              />
            )}
            ListEmptyComponent={() => (
              <View className="items-center mt-10">
                <Text className="text-text-secondary font-medium">
                  {search ? t('patient.no_results') : t('patient.empty_list')}
                </Text>
              </View>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        </>
      )}

      {/* ELEMENTOS FLOTANTES*/}

      <PatientDetail 
        visible={isDetailVisible}
        patient={selectedPatient}
        onClose={() => setIsDetailVisible(false)} 
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteFromDetail}
      />

      <FloatingFormContainer 
        visible={isFormVisible} 
        onClose={handleCloseForm} 
        // Cambiamos el título dinámicamente
        title={selectedPatient ? t('FormPatient.editPatient') : t('FormPatient.addPatient')} 
        iconName={selectedPatient ? 'edit' : 'supervised-user-circle'}>
          <PatientForm 
            onSuccess={handleSaveSucces}
            initialData={selectedPatient}
          />
      </FloatingFormContainer>

      <FloatingButton onPress={handleAddPatient} iconName="add" />

      <StatusModal
    isVisible={statusModal.visible}
    type={statusModal.type}
    title={statusModal.title}
    message={statusModal.message}
    confirmLabel={statusModal.confirmLabel}
    cancelLabel={statusModal.cancelLabel}
    onConfirm={statusModal.onConfirm || (() => setStatusModal(prev => ({ ...prev, visible: false })))}
    onCancel={statusModal.onCancel} 
  />
    </View>
  );
}