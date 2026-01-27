export interface TherapistProfile {
  uid: string;     
  email: string;
  firstName: string;
  lastName: string;
  stats: {
    totalPatients: number;
    totalAppointments: number;
  };
  createdAt: string; 
  role: 'therapist';
}