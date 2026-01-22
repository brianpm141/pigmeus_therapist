import { View, Text } from 'react-native';
import { useState } from 'react';
import { FloatingButton } from '@/components/ui/FloatingButton';
import { FloatingFormContainer } from '@/components/layout/Molecules';
import { useTranslation } from 'react-i18next';
import { PatientForm } from '@/features/patients/components/PatientForm';

export default function PatientsScreen() {


  const { t } = useTranslation();
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleAddPatient = () => {
    console.log('Abriendo formulario de creacion de paciente...');
    setIsFormVisible(true);
  }

  const handleCloseForm = () => {
    setIsFormVisible(false);
  }

  return (
    <View className="flex-1 justify-center items-center bg-background-light dark:bg-background-dark">

      <Text className="text-2xl font-bold text-primary">Pacientes</Text>
      <Text className="text-text-secondary-dark mt-2">Vista para la administracion de pacientes</Text>
      

    {/* Formulario flotante */}
    <FloatingFormContainer 
    visible={isFormVisible} onClose={handleCloseForm} title={t('FormPatient.addPatient')} iconName='supervised-user-circle'>
        <PatientForm />
    </FloatingFormContainer>

      <FloatingButton onPress={handleAddPatient} iconName="add" />
    </View>
  );
}