import { Timestamp } from 'firebase/firestore';

export interface TherapistProfile {
  uid: string;     
  email: string;
  firstName: string;
  lastName: string;
  photoURL: string;
  birthDate?: Timestamp | Date;
  stats: {
    totalPatients: number;
    totalAppointments: number;
  };
  createdAt: string; 
  role: 'therapist';
  
}