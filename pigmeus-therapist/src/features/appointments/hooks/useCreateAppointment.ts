import { useState, useCallback } from 'react';
import { RecurrenceType, EndConditionType } from '@/types/appointments';
import { AppointmentService } from '@/services/appointmentService';
import { useTherapistProfile } from '@/features/auth/hooks/useTherapistProfile';

export const useCreateAppointment = (onSuccess?: () => void) => {
  const { profile } = useTherapistProfile();

  // Estados
  const [patientId, setPatientId] = useState<string | undefined>();
  const [patientName, setPatientName] = useState(''); 
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<Date | undefined>(undefined);
  const [duration, setDuration] = useState('60'); 
  
  const [recurrence, setRecurrence] = useState<RecurrenceType>('single');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [repeatWeeks, setRepeatWeeks] = useState('');
  const [endCondition, setEndCondition] = useState<EndConditionType>('weeks');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- LÓGICA DE LIMPIEZA (NUEVO) ---
  const resetForm = useCallback(() => {
    setPatientId(undefined);
    setPatientName('');
    setDate(undefined);
    setTime(undefined);
    setDuration('60');
    setRecurrence('single');
    setSelectedDays([]);
    setRepeatWeeks('');
    setEndCondition('weeks');
    setErrors({});
  }, []);

  // --- Helpers ---
  const toggleDay = useCallback((dayId: string) => {
    setSelectedDays(prev => 
      prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId]
    );
  }, []);

  const handleWeeksChange = useCallback((text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setRepeatWeeks(numericValue);
    if (numericValue) setEndCondition('weeks');
  }, []);

  const submit = async () => {
    setErrors({});
    const newErrors: Record<string, string> = {};

    // Validaciones
    if (!patientId) newErrors.patientId = 'errors.required';
    if (!date) newErrors.date = 'errors.required';
    if (!time) newErrors.time = 'errors.required';
    if (!duration) newErrors.duration = 'errors.required';
    
    if (recurrence === 'program') {
      if (selectedDays.length === 0) newErrors.days = 'errors.minDays';
      if (endCondition === 'weeks' && !repeatWeeks) newErrors.weeks = 'errors.required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!profile?.uid) return;

    setIsSubmitting(true);
    try {
      await AppointmentService.create(profile.uid, {
        patientId: patientId!,
        patientName,
        date: date!,
        time: time!,
        durationMinutes: parseInt(duration, 10),
        recurrence,
        selectedDays,
        endCondition,
        repeatWeeks
      });
      
      // Limpiamos al tener éxito
      resetForm();
      if (onSuccess) onSuccess();
    } catch (e) {
      console.error("Error creating appointment:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form: {
      patientId, setPatientId,
      patientName, setPatientName,
      date, setDate,
      time, setTime,
      duration, setDuration,
      recurrence, setRecurrence,
      selectedDays,
      repeatWeeks,
      endCondition, setEndCondition
    },
    actions: {
      toggleDay,
      handleWeeksChange,
      submit,
      resetForm // Exportamos la función
    },
    ui: {
      isSubmitting,
      errors
    }
  };
};