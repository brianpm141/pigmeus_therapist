import { Timestamp } from 'firebase/firestore';

export interface Patient {
  id: string; // ID del documento
  fullName: string;
  personalInfo: {
    bornDate: Timestamp ;
    age: number;
    gender: string;
  };
  physicalMetrcs: {
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
}