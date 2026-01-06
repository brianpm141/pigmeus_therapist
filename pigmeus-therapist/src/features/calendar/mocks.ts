import { Appointment } from "@/types/firestore";
import { Timestamp } from "firebase/firestore";

// Helper para fechas relativas (Hoy, Mañana, Ayer)
const getRelativeDate = (daysOffset: number, hour: number, minute: number = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(hour, minute, 0, 0);
  return Timestamp.fromDate(date);
};

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    therapistId: "me",
    patientId: "p_1",
    patientName: "Juan Pérez", 
    // Nota: Eliminamos diagnosisSnippet según tu última interfaz
    date: getRelativeDate(0, 9, 0), // Hoy 9:00 AM
    duration: 60,
    recurrenceGroupId: "serie_A"
  },
  {
    id: "2",
    therapistId: "me",
    patientId: "p_2",
    patientName: "Maria Gonzalez",
    date: getRelativeDate(0, 10, 30), // Hoy 10:30 AM
    duration: 45,
  },
  {
    id: "3",
    therapistId: "me",
    patientId: "p_3",
    patientName: "Carlos Ruiz",
    date: getRelativeDate(0, 13, 0), // Hoy 1:00 PM
    duration: 60,
    recurrenceGroupId: "serie_B"
  },
  {
    id: "4",
    therapistId: "me",
    patientId: "p_4",
    patientName: "Ana Torres",
    date: getRelativeDate(1, 11, 0), // Mañana 11:00 AM
    duration: 90,
  }
];