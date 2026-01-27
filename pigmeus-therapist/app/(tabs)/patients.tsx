import { View, Text, FlatList, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import { useState, useMemo } from 'react';
import { FloatingButton } from '@/components/ui/FloatingButton';
import { FloatingFormContainer, StatusModal } from '@/components/layout/Molecules';
import { useTranslation } from 'react-i18next';
import { PatientCard, PatientForm, PatientDetail } from '@/features/patients/components/PatientComponets';
import { usePatients } from '@/features/patients/hooks/usePatients';
import { MaterialIcons } from '@expo/vector-icons';
import { Patient } from '@/types/patient';
import { deletePatient } from '@/services/patientService';
import { useTheme } from '@/core/ThemeContext';
import { useAuth } from '@/features/auth/AuthContext';

export default function PatientsScreen() {

  const { t } = useTranslation();
  type ModalType = 'info' | 'delete' | 'error';
  const { colors } = useTheme(); 
  const { user } = useAuth();
  

 // ---------------------- Gestion de Cards -----------------------

  const { patients, loading } = usePatients(user?.uid);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);


  const filteredPatients = useMemo(() => {
  const normalize = (text: string) => 
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const searchNormalized = normalize(search);
  return patients.filter(p => 
    normalize(p.fullName).includes(searchNormalized)
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
  if(!user) {
    throw new Error ("No hay usuario registrado")
  }

  try {
    const result = await deletePatient(selectedPatient.id, user.uid);
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
      className="flex-1 bg-background-light dark:bg-background-dark px-7" 
    >
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator className="text-primary" size="large" />
        </View>
      ) : (
        <> 
          
          {/* FILA TÍTULO */}
          <View className="flex-row items-center justify-between my-3">
            <Text className="text-2xl font-extrabold text-text-primary dark:text-text-inverse">
              {t('common.pacientName')}
            </Text>

            { /*<TouchableOpacity 
              className="bg-surface-light dark:bg-surface-dark p-3 rounded-xl  active:bg-primary/10"
              onPress={() => console.log('Filtros')}
            >
              <MaterialIcons name="filter-list" size={18} className="text-primary" color={colors.primary} />
            </TouchableOpacity> */}
          </View>

          <View className="flex-row items-center bg-surface-light dark:bg-surface-dark rounded-xl px-4 h-12 mb-6">
            <MaterialIcons name="search" size={20} color={colors.primary}/>
            <TextInput
              className="flex-1 ml-2 text-text-primary dark:text-text-inverse font-sans"
              placeholder={t('common.searchPlaceholder')}
              placeholderTextColor="#94a3b8"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <MaterialIcons name="close" size={20} color="#94a3b8" />
              </TouchableOpacity>
            )}
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
                  {search ? t('info.no_results') : t('info.empty_list')}
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