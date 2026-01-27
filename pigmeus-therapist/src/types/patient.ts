import { Timestamp } from 'firebase/firestore';

export interface Patient {
  id: string; 
  therapistId: string; // ID del terapeuta dueño del registro
  fullName: string;
  personalInfo: {
    bornDate: Timestamp;
    age: number;
    gender: string;
  };
  physicalMetrics: {
    weight: number;
    height: number;
  };
  clinicalRecord: {
    diagnosis: string;
    treatmentPlan: string;
  };
  contact: {
    phone: string;
    address: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
  };
  nextAppointment?: string; 
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}