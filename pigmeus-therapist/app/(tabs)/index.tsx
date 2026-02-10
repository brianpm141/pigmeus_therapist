import React, { useState, useCallback, useMemo } from 'react';
import { View, ActivityIndicator, Alert, Platform } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { DateStrip } from '@/components/layout/DateStrip';
import { TimeSlotGrid } from '@/components/layout/TimeSlotGrid';
import { FloatingButton } from '@/components/ui/UIComponents';
import { NewAppointmentForm } from '@/features/appointments/components/AppointmenstForm';
import { AppointmentDetail } from '@/features/appointments/components/AppointmentDetail'; 
import { AppointmentService } from '@/services/appointmentService'; 
import { useTherapistProfile } from '@/features/auth/hooks/useTherapistProfile';
import { Appointment, ConsultationItem } from '@/types/appointments';

export default function AgendaScreen() {
  const { t } = useTranslation();
  const { profile } = useTherapistProfile();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  // Nuevo estado para el Detalle
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ConsultationItem | null>(null); // Se usa tanto para detalle como para edición
  
const fetchAppointments = useCallback(async () => {
    if (!profile?.uid) return;
    setIsLoading(true);
    try {
        const { appointments } = await AppointmentService.getAllAppointmentsForAgenda(profile.uid);
        setAppointments(appointments);
    } catch (error) {
        console.error("Error fetching agenda:", error);
    } finally {
        setIsLoading(false);
    }
}, [profile?.uid]);

  useFocusEffect(
    useCallback(() => { fetchAppointments(); }, [fetchAppointments])
  );

  const currentDayAppointments = useMemo(() => {
    return appointments.filter(app => {
      const appDate = app.date.toDate();
      return (
        appDate.getDate() === selectedDate.getDate() &&
        appDate.getMonth() === selectedDate.getMonth() &&
        appDate.getFullYear() === selectedDate.getFullYear() &&
        app.status !== 'cancelled'
      );
    });
  }, [appointments, selectedDate]);

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (event.type === 'set' && date) {
      setSelectedDate(date);
    }
  };

  const handleOpenCreate = (dateOverride?: Date) => {
    setEditingItem(null); 
    if (dateOverride) console.log("Slot:", dateOverride);
    setIsFormVisible(true);
  };

  // --- NUEVO: Función para ABRIR DETALLE (Llamada al pulsar tarjeta) ---
  const handleOpenDetail = (appointmentId: string) => {
    const app = appointments.find(a => a.id === appointmentId);
    if (app) {
      const item: ConsultationItem = {
        type: 'single',
        data: app,
        nextDate: app.date.toDate()
      };
      setEditingItem(item);
      setIsDetailVisible(true); // Abrimos el detalle, NO el formulario
    }
  };

  // --- Función para IR A EDITAR (Desde el detalle) ---
  const handleEditFromDetail = () => {
    setIsDetailVisible(false); // Cerramos detalle
    setTimeout(() => {
        setIsFormVisible(true); // Abrimos formulario con el mismo editingItem
    }, 300);
  };

  // Función para eliminar desde detalle
  const handleDeleteFromDetail = () => {
      if (editingItem) {
          handleCancel(editingItem.data.id);
          setIsDetailVisible(false);
      }
  };

  const handleAccept = async (id: string) => {
    try {
      await AppointmentService.update(profile!.uid, id, 'single', { status: 'completed' } as any); 
      fetchAppointments(); 
    } catch (error) {
      Alert.alert(t('info.genericError'), t('info.confirmError'));
    }
  };

  const handleCancel = async (id: string) => {
    Alert.alert(t('info.cancelTitle'), t('info.cancelMessage'), [
        { text: t('actions.cancel'), style: "cancel" },
        { text: t('info.yesCancel'), style: "destructive", onPress: async () => {
            await AppointmentService.cancelAppointment(id);
            fetchAppointments();
          }
        }
    ]);
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <DateStrip 
        selectedDate={selectedDate} 
        onSelectDate={setSelectedDate} 
        onCalendarPress={() => setShowDatePicker(true)}
      />

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0ea5c3" />
        </View>
      ) : (
        <TimeSlotGrid 
          selectedDate={selectedDate}
          appointments={currentDayAppointments}
          onAddAppointment={handleOpenCreate}
          onAccept={handleAccept}
          onCancel={handleCancel}
          // CAMBIO CLAVE: Usamos handleOpenDetail en lugar de ir directo a editar
          onCardPress={handleOpenDetail} 
        />
      )}

      <FloatingButton onPress={() => handleOpenCreate()} iconName="add" />

      {/* --- MODAL DE DETALLE --- */}
      <AppointmentDetail
        visible={isDetailVisible}
        item={editingItem}
        onClose={() => setIsDetailVisible(false)}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteFromDetail}
      />

      {/* --- MODAL DE FORMULARIO (Edición/Creación) --- */}
      <NewAppointmentForm
        visible={isFormVisible}
        onClose={() => setIsFormVisible(false)}
        onSuccess={() => { setIsFormVisible(false); fetchAppointments(); }}
        initialData={editingItem}
      />

      {showDatePicker && (
        <RNDateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}