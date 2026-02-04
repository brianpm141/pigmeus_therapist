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
import { db } from '@/core/firebase/firebaseConfig'; // Asegúrate que esta ruta a tu config sea correcta
import { Appointment, CreateAppointmentDTO, RecurrencePattern } from '@/types/appointments';

const DAY_MAP: Record<string, number> = {
  'D': 0, 'L': 1, 'M1': 2, 'M2': 3, 'J': 4, 'V': 5, 'S': 6
};

// Configuración de Horizonte
const INITIAL_HORIZON_WEEKS = 26; 

export const AppointmentService = {
  
  // 1. Crear Cita (Única o Recurrente)
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
        // Fecha límite generada (aprox)
        lastGeneratedDate: Timestamp.fromDate(
          new Date(new Date().getTime() + (weeksToGenerate * 7 * 24 * 60 * 60 * 1000))
        ),
        createdAt: Timestamp.now(),
      };

      batch.set(patternDoc, patternData);
    }

    // --- GENERACIÓN DE CITAS (EXPANSIÓN) ---
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
          
          // Saltar si la fecha calculada es anterior a la fecha de inicio
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
          
          // FIX: Spread condicional para evitar 'undefined' en Firestore
          ...(patternId && { patternId }), 
          
          createdAt: Timestamp.now(),
        };

        batch.set(newDocRef, appointmentData);
      }
    }
    await batch.commit();
  },

  // 2. Obtener Consultas Activas (Híbrido: Citas Sueltas + Patrones)
  getActiveConsultations: async (therapistId: string) => {
    // A. Obtener Citas Sueltas (Scheduled)
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
    
    // Filtramos en memoria las que NO tienen patternId (son citas únicas)
    const singleAppointments = appSnaps.docs
      .map(d => ({ id: d.id, ...d.data() } as Appointment))
      .filter(a => !a.patternId); 

    // B. Obtener Patrones Recurrentes Activos
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

  // 5. Método Update (Edición Inteligente)
  update: async (
    therapistId: string, 
    id: string, 
    currentType: 'single' | 'periodic', 
    data: CreateAppointmentDTO
  ) => {
    const batch = writeBatch(db);

    // CASO 1: CITA ÚNICA
    // Simplemente actualizamos los datos del documento existente
    if (currentType === 'single') {
      const finalDate = new Date(data.date);
      const timePart = new Date(data.time);
      // Fusionamos Fecha y Hora
      finalDate.setHours(timePart.getHours(), timePart.getMinutes(), 0, 0);

      const docRef = doc(db, 'appointments', id);
      
      batch.update(docRef, {
        patientId: data.patientId,
        patientName: data.patientName,
        date: Timestamp.fromDate(finalDate),
        durationMinutes: data.durationMinutes,
        // Si tienes notas en el DTO, agrégalas aquí
      });
    }

    // CASO 2: PATRÓN RECURRENTE
    // Actualizamos el maestro y regeneramos el futuro
    else if (currentType === 'periodic') {
      
      // A. Actualizar el documento Maestro (Pattern)
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
        // Actualizamos el horizonte de generación
        lastGeneratedDate: Timestamp.fromDate(
          new Date(new Date().getTime() + (weeksToGenerate * 7 * 24 * 60 * 60 * 1000))
        )
      });

      // B. Limpieza: Eliminar citas futuras viejas para evitar conflictos
      // Buscamos todas las citas hijas de este patrón que sean futuras
      const appRef = collection(db, 'appointments');
      const qFuture = query(
        appRef,
        where('patternId', '==', id),
        where('date', '>=', Timestamp.now()), // Solo futuras
        where('status', '==', 'scheduled')
      );
      
      // Nota: Necesitamos leer para saber cuáles borrar (Firestore requiere referencia)
      const futureSnaps = await getDocs(qFuture);
      futureSnaps.forEach((d) => {
        batch.delete(d.ref);
      });

      // C. Regeneración: Crear las nuevas citas futuras con los datos editados
      // Usamos la fecha actual como base para no regenerar el pasado
      const baseRegenDate = new Date(); 
      const baseTime = new Date(data.time);

      for (let w = 0; w < weeksToGenerate; w++) {
        for (const dayId of data.selectedDays) {
          let targetDate = new Date(baseRegenDate);
          targetDate.setDate(targetDate.getDate() + (w * 7));

          // Ajuste matemático para encontrar el próximo Lunes/Martes/etc.
          const targetDayIndex = DAY_MAP[dayId];
          const currentDayIndex = targetDate.getDay();
          const diff = targetDayIndex - currentDayIndex;
          targetDate.setDate(targetDate.getDate() + diff);

          // IMPORTANTE: Solo creamos si la fecha es HOY o FUTURO
          if (targetDate < baseRegenDate) continue;

          // Configurar Hora
          const finalDateTime = new Date(targetDate);
          finalDateTime.setHours(baseTime.getHours(), baseTime.getMinutes(), 0, 0);

          // Crear nueva instancia
          const newDocRef = doc(collection(db, 'appointments'));
          
          const appointmentData: Appointment = {
            id: newDocRef.id,
            therapistId,
            patientId: data.patientId,
            patientName: data.patientName,
            date: Timestamp.fromDate(finalDateTime),
            durationMinutes: data.durationMinutes,
            status: 'scheduled',
            patternId: id, // Vinculamos al mismo patrón original
            createdAt: Timestamp.now(),
          };

          batch.set(newDocRef, appointmentData);
        }
      }
    }

    // Ejecutar todo el lote (Updates + Deletes + Creates)
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

  // 4. Hard Delete (Cascada)
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