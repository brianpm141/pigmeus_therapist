import { 
  collection, 
  doc, 
  writeBatch, 
  Timestamp,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  deleteDoc,
  limit
} from 'firebase/firestore';
import { db } from '@/core/firebase/firebaseConfig'; 
import { Appointment, CreateAppointmentDTO, RecurrencePattern } from '@/types/appointments';

const DAY_MAP: Record<string, number> = {
  'D': 0, 'L': 1, 'M1': 2, 'M2': 3, 'J': 4, 'V': 5, 'S': 6
};

const INITIAL_HORIZON_WEEKS = 26; 

export const AppointmentService = {
  
  create: async (therapistId: string, data: CreateAppointmentDTO) => {
    const batch = writeBatch(db);
    
    const appointmentsRef = collection(db, 'appointments');
    const patternsRef = collection(db, 'recurrence_patterns');
    
    let patternId: string | undefined = undefined;
    let weeksToGenerate = 1;

    // --- LÓGICA DE RECURRENCIA ---
    if (data.recurrence === 'program') {
      const patternDoc = doc(patternsRef);
      patternId = patternDoc.id;

      if (data.endCondition === 'weeks') {
        weeksToGenerate = parseInt(data.repeatWeeks) || 1;
      } else {
        weeksToGenerate = INITIAL_HORIZON_WEEKS;
      }

      const patternData: RecurrencePattern = {
        id: patternId,
        therapistId,
        patientId: data.patientId,
        patientName: data.patientName,
        type: 'weekly',
        daysOfWeek: data.selectedDays,
        time: Timestamp.fromDate(data.time),
        durationMinutes: data.durationMinutes,
        status: 'active',
        startDate: Timestamp.fromDate(data.date),
        lastGeneratedDate: Timestamp.fromDate(
          new Date(new Date().getTime() + (weeksToGenerate * 7 * 24 * 60 * 60 * 1000))
        ),
        createdAt: Timestamp.now(),
      };

      batch.set(patternDoc, patternData);
    }

    const baseDate = new Date(data.date);
    const baseTime = new Date(data.time);

    for (let w = 0; w < weeksToGenerate; w++) {
      const daysToProcess = data.recurrence === 'single' 
        ? ['current'] 
        : data.selectedDays;

      for (const dayId of daysToProcess) {
        let targetDate = new Date(baseDate);
        targetDate.setDate(targetDate.getDate() + (w * 7));

        if (data.recurrence === 'program') {
          const targetDayIndex = DAY_MAP[dayId];
          const currentDayIndex = targetDate.getDay();
          const diff = targetDayIndex - currentDayIndex;
          targetDate.setDate(targetDate.getDate() + diff);
          
          if (w === 0 && targetDate < baseDate) continue;
        }

        const finalDateTime = new Date(targetDate);
        finalDateTime.setHours(baseTime.getHours(), baseTime.getMinutes(), 0, 0);

        const newDocRef = doc(appointmentsRef);
        
        const appointmentData: Appointment = {
          id: newDocRef.id,
          therapistId,
          patientId: data.patientId,
          patientName: data.patientName,
          date: Timestamp.fromDate(finalDateTime),
          durationMinutes: data.durationMinutes,
          status: 'scheduled',
          
          ...(patternId && { patternId }), 
          
          createdAt: Timestamp.now(),
        };

        batch.set(newDocRef, appointmentData);
      }
    }
    await batch.commit();
  },

  // MANTENIDA IGUAL (Para compatibilidad con otras vistas)
  getActiveConsultations: async (therapistId: string) => {
    const appRef = collection(db, 'appointments');
    const qApp = query(
      appRef,
      where('therapistId', '==', therapistId),
      where('status', '==', 'scheduled'),
      where('date', '>=', Timestamp.now()),
      orderBy('date', 'asc'),
      limit(50)
    );
    const appSnaps = await getDocs(qApp);
    
    // Esta filtra las periódicas (comportamiento original)
    const singleAppointments = appSnaps.docs
      .map(d => ({ id: d.id, ...d.data() } as Appointment))
      .filter(a => !a.patternId); 

    const patRef = collection(db, 'recurrence_patterns');
    const qPat = query(
      patRef,
      where('therapistId', '==', therapistId),
      where('status', '==', 'active')
    );
    const patSnaps = await getDocs(qPat);
    const patterns = patSnaps.docs.map(d => ({ id: d.id, ...d.data() } as RecurrencePattern));

    return { singleAppointments, patterns };
  },

  // --- NUEVA FUNCIÓN: ESPECÍFICA PARA LA AGENDA ---
  // Trae TODAS las citas (singles + patterns) para mostrarlas en el grid
  getAllAppointmentsForAgenda: async (therapistId: string) => {
    const appRef = collection(db, 'appointments');
    const qApp = query(
      appRef,
      where('therapistId', '==', therapistId),
      where('status', '==', 'scheduled'),
      where('date', '>=', Timestamp.now()), // Puedes ajustar esto a startOfDay si necesitas ver las de hoy temprano
      orderBy('date', 'asc'),
      limit(100) // Límite más amplio para la agenda
    );
    const appSnaps = await getDocs(qApp);
    
    // Aquí NO filtramos por patternId. Devolvemos todo.
    const appointments = appSnaps.docs
      .map(d => ({ id: d.id, ...d.data() } as Appointment));

    return { appointments };
  },

  update: async (
    therapistId: string, 
    id: string, 
    currentType: 'single' | 'periodic', 
    data: CreateAppointmentDTO
  ) => {
    const batch = writeBatch(db);

    if (currentType === 'single') {
      const finalDate = new Date(data.date);
      const timePart = new Date(data.time);
      finalDate.setHours(timePart.getHours(), timePart.getMinutes(), 0, 0);

      const docRef = doc(db, 'appointments', id);
      
      batch.update(docRef, {
        patientId: data.patientId,
        patientName: data.patientName,
        date: Timestamp.fromDate(finalDate),
        durationMinutes: data.durationMinutes,
      });
    }

    else if (currentType === 'periodic') {
      const patternRef = doc(db, 'recurrence_patterns', id);
      
      let weeksToGenerate = INITIAL_HORIZON_WEEKS;
      if (data.endCondition === 'weeks') {
        weeksToGenerate = parseInt(data.repeatWeeks) || 1;
      }

      batch.update(patternRef, {
        patientId: data.patientId,
        patientName: data.patientName,
        daysOfWeek: data.selectedDays,
        time: Timestamp.fromDate(data.time),
        durationMinutes: data.durationMinutes,
        lastGeneratedDate: Timestamp.fromDate(
          new Date(new Date().getTime() + (weeksToGenerate * 7 * 24 * 60 * 60 * 1000))
        )
      });

      const appRef = collection(db, 'appointments');
      const qFuture = query(
        appRef,
        where('patternId', '==', id),
        where('date', '>=', Timestamp.now()), 
        where('status', '==', 'scheduled')
      );
      
      const futureSnaps = await getDocs(qFuture);
      futureSnaps.forEach((d) => {
        batch.delete(d.ref);
      });

      const baseRegenDate = new Date(); 
      const baseTime = new Date(data.time);

      for (let w = 0; w < weeksToGenerate; w++) {
        for (const dayId of data.selectedDays) {
          let targetDate = new Date(baseRegenDate);
          targetDate.setDate(targetDate.getDate() + (w * 7));

          const targetDayIndex = DAY_MAP[dayId];
          const currentDayIndex = targetDate.getDay();
          const diff = targetDayIndex - currentDayIndex;
          targetDate.setDate(targetDate.getDate() + diff);

          if (targetDate < baseRegenDate) continue;

          const finalDateTime = new Date(targetDate);
          finalDateTime.setHours(baseTime.getHours(), baseTime.getMinutes(), 0, 0);

          const newDocRef = doc(collection(db, 'appointments'));
          
          const appointmentData: Appointment = {
            id: newDocRef.id,
            therapistId,
            patientId: data.patientId,
            patientName: data.patientName,
            date: Timestamp.fromDate(finalDateTime),
            durationMinutes: data.durationMinutes,
            status: 'scheduled',
            patternId: id, 
            createdAt: Timestamp.now(),
          };

          batch.set(newDocRef, appointmentData);
        }
      }
    }

    await batch.commit();
  },

  cancelAppointment: async (appointmentId: string) => {
    const docRef = doc(db, 'appointments', appointmentId);
    await updateDoc(docRef, { status: 'cancelled' });
  },
  
  cancelPattern: async (patternId: string) => {
    const docRef = doc(db, 'recurrence_patterns', patternId);
    await updateDoc(docRef, { status: 'cancelled' });
  },

  deleteAppointment: async (appointmentId: string) => {
    const docRef = doc(db, 'appointments', appointmentId);
    await deleteDoc(docRef); 
  },

  deletePattern: async (patternId: string) => {
    const batch = writeBatch(db);
    const patternRef = doc(db, 'recurrence_patterns', patternId);
    batch.delete(patternRef);
    const appointmentsRef = collection(db, 'appointments');
    const q = query(appointmentsRef, where('patternId', '==', patternId));
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }
};