import { Timestamp } from 'firebase/firestore';

// ---------------------------------------------------------
// 1. Usuario (Terapeuta/Medico)
// ---------------------------------------------------------
export interface TherapistProfile {
    uid: string;           // ID unico
    email: string;
    firstName: string;
    lastName: string;
    stats: {
        totalPatients: number;
        totalAppointments: number;
    };
}

// ---------------------------------------------------------
// 2. PACIENTE
// ---------------------------------------------------------
export interface Patient {
    id: string;
    therapistId: string;   // Enlace de seguridad (terapeuta)

    // Datos Personales
    firstName: string;
    lastName: string;
    birthDate: Timestamp;
    gender?: 'M' | 'F' | 'O'; // Opcional
    
    // Datos Físicos
    height: number;        // en cm
    weight: number;        // en kg
    
    // Datos Médicos
    diagnosis: string;     // Ej: "Esguince de Tobillo"
    notes?: string;        // Notas generales del paciente
    
    createdAt: Timestamp;  // Fecha de registro
}

export interface Appointment {
    id: string;
    therapistId: string;
    patientId: string;
    patientName: string;

    // --- TIEMPOS ---
    date: Timestamp;       // Fecha y Hora exacta de inicio
    duration: number;      // Duración en minutos (ej: 30, 45, 60)
    
    // --- RECURRENCIA ---
    recurrenceGroupId?: string; 

}