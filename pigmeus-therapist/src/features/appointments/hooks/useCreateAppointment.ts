import { useState, useCallback, useEffect } from 'react';
import { RecurrenceType, EndConditionType, ConsultationItem } from '@/types/appointments';
import { AppointmentService } from '@/services/appointmentService';
import { useTherapistProfile } from '@/features/auth/hooks/useTherapistProfile';

export const useCreateAppointment = (onSuccess?: () => void, initialData?: ConsultationItem | null) => {
  const { profile } = useTherapistProfile();

  // Estados del Formulario
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

  // --- Helper para fechas seguras (Maneja Timestamp y Date) ---
  const safeDate = (val: any): Date | undefined => {
    if (!val) return undefined;
    // Si viene de Firebase (Timestamp)
    if (typeof val.toDate === 'function') return val.toDate();
    // Si ya es fecha JS
    if (val instanceof Date) return val;
    // Fallback
    return new Date(val);
  };

  // --- Limpieza ---
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

  // --- Cargar Datos Iniciales (Edición) ---
  useEffect(() => {
    if (initialData) {
      // TypeScript es inteligente: si chequeamos el type, sabe qué estructura tiene data.
      
      if (initialData.type === 'periodic') {
        // ES UN PATRÓN RECURRENTE
        const pattern = initialData.data; // Aquí data es RecurrencePattern
        
        setPatientId(pattern.patientId);
        setPatientName(pattern.patientName);
        setDuration(pattern.durationMinutes.toString());
        setRecurrence('program');
        setSelectedDays(pattern.daysOfWeek || []);
        
        // Mapeo específico de patrón
        setDate(safeDate(pattern.startDate));
        setTime(safeDate(pattern.time));

      } else {
        // ES UNA CITA ÚNICA
        const appointment = initialData.data; // Aquí data es Appointment
        
        setPatientId(appointment.patientId);
        setPatientName(appointment.patientName);
        setDuration(appointment.durationMinutes.toString());
        setRecurrence('single');
        setSelectedDays([]); // Limpiamos residuos
        
        // Mapeo específico de cita (date contiene fecha y hora)
        const d = safeDate(appointment.date);
        setDate(d);
        setTime(d);
      }
    } else {
      // MODO CREAR
      resetForm();
    }
  }, [initialData, resetForm]);

  // --- Helpers UI ---
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

  // --- Envío ---
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
        // Preparamos el DTO
        const appointmentDTO = {
            patientId: patientId!,
            patientName,
            date: date!,
            time: time!,
            durationMinutes: parseInt(duration, 10),
            recurrence,
            selectedDays,
            endCondition,
            repeatWeeks
        };

        // Decisión: Crear o Actualizar
        if (initialData && initialData.data.id) {
            // UPDATE
            await AppointmentService.update(
                profile.uid,
                initialData.data.id, 
                initialData.type,     
                appointmentDTO
            );
        } else {
            // CREATE
            await AppointmentService.create(profile.uid, appointmentDTO);
        }
      
      resetForm();
      if (onSuccess) onSuccess();
    } catch (e) {
      console.error("Error saving appointment:", e);
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
      resetForm 
    },
    ui: {
      isSubmitting,
      errors
    }
  };
};