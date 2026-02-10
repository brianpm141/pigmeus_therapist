import { useState, useEffect, useMemo, useCallback } from 'react';
import { AppointmentService } from '@/services/appointmentService'; 
import { ConsultationItem, RecurrencePattern } from '@/types/appointments';
import { useTherapistProfile } from '@/features/auth/hooks/useTherapistProfile';
import { format, isToday, isTomorrow, getDay, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

const getNextPatternOccurrence = (pattern: RecurrencePattern): Date => {
  const today = new Date();
  const dayMap: Record<string, number> = { 'D': 0, 'L': 1, 'M1': 2, 'M2': 3, 'J': 4, 'V': 5, 'S': 6 };
  const targetDays = pattern.daysOfWeek.map(d => dayMap[d]);
  
  for (let i = 0; i < 7; i++) {
    const checkDate = addDays(today, i);
    const currentDay = getDay(checkDate);
    
    if (targetDays.includes(currentDay)) {
      const occurrence = new Date(checkDate);
      const patternTime = pattern.time.toDate();
      occurrence.setHours(patternTime.getHours(), patternTime.getMinutes(), 0, 0);
      if (occurrence >= new Date() || isToday(occurrence)) {
        return occurrence;
      }
    }
  }
  return today; // Fallback
};

export const useConsultations = () => {
  const { profile } = useTherapistProfile();
  const [items, setItems] = useState<ConsultationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async () => {
    if (!profile?.uid) return;
    try {
      const { singleAppointments, patterns } = await AppointmentService.getActiveConsultations(profile.uid);

      // 1. Transformar Citas Únicas
      const singles: ConsultationItem[] = singleAppointments.map(app => ({
        type: 'single',
        data: app,
        nextDate: app.date.toDate()
      }));

      // 2. Transformar Patrones (Calculando su próxima fecha)
      const periodics: ConsultationItem[] = patterns.map(pat => ({
        type: 'periodic',
        data: pat,
        nextDate: getNextPatternOccurrence(pat)
      }));

      // 3. Unificar y Ordenar por fecha
      const allItems = [...singles, ...periodics].sort((a, b) => 
        a.nextDate.getTime() - b.nextDate.getTime()
      );

      setItems(allItems);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [profile?.uid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCancel = async (id: string, isPattern: boolean) => {
    try {
      if (isPattern) {
        await AppointmentService.deletePattern(id);
      } else {
        await AppointmentService.deleteAppointment(id);
      }
      fetchData(); 
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const sections = useMemo(() => {
    const filtered = items.filter(item => {
      const name = item.type === 'single' ? item.data.patientName : item.data.patientName;
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const groups: Record<string, ConsultationItem[]> = {};
    
    filtered.forEach(item => {
      const dateKey = format(item.nextDate, 'yyyy-MM-dd');
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(item);
    });

    return Object.keys(groups).map(key => {
      const dateObj = new Date(key + 'T00:00:00'); // Fix zona horaria simple
      let title = format(dateObj, "d 'de' MMMM", { locale: es });
      
      if (isToday(dateObj)) title = `Hoy ${title}`;
      else if (isTomorrow(dateObj)) title = `Mañana ${title}`;
      
      return { title: title.charAt(0).toUpperCase() + title.slice(1), data: groups[key] };
    });
  }, [items, searchQuery]);

  return {
    sections,
    loading,
    refreshing,
    onRefresh: () => { setRefreshing(true); fetchData(); },
    searchQuery,
    setSearchQuery,
    handleCancel // Exportamos la función
  };
};