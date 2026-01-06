import { db } from "@/services/firebase"; // Tu configuración inicial
import { COLLECTIONS } from "@/core/constants";
import { Appointment } from "@/types/firestore";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  Timestamp, 
  orderBy 
} from "firebase/firestore";

// Referencia a la colección
const appointmentsRef = collection(db, COLLECTIONS.APPOINTMENTS);

export const AppointmentService = {
  /**
   * Obtiene todas las citas de un terapeuta para un día específico.
   * Firestore requiere consultar un RANGO de fechas (StartOfDay -> EndOfDay).
   */
  getAppointmentsByDate: async (therapistId: string, date: Date): Promise<Appointment[]> => {
    try {
      // 1. Calcular inicio y fin del día
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // 2. Convertir a Timestamp de Firebase
      const startTimestamp = Timestamp.fromDate(startOfDay);
      const endTimestamp = Timestamp.fromDate(endOfDay);

      // 3. Crear Query (Filtro compuesto)
      // "Dame documentos donde therapistId sea X Y la fecha esté entre inicio y fin"
      const q = query(
        appointmentsRef,
        where("therapistId", "==", therapistId),
        where("date", ">=", startTimestamp),
        where("date", "<=", endTimestamp),
        orderBy("date", "asc") // Ordenar por hora (necesita índice compuesto en Firestore)
      );

      // 4. Ejecutar
      const snapshot = await getDocs(q);

      // 5. Mapear resultados
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Appointment[];

    } catch (error) {
      console.error("Error al obtener citas:", error);
      throw error;
    }
  },

  /**
   * Crea una nueva cita en la base de datos
   */
  createAppointment: async (appointment: Omit<Appointment, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(appointmentsRef, appointment);
      return docRef.id;
    } catch (error) {
      console.error("Error creando cita:", error);
      throw error;
    }
  }
};