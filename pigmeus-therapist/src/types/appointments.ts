import { Timestamp } from 'firebase/firestore';

export type RecurrenceType = 'single' | 'program';
export type EndConditionType = 'weeks' | 'manual';

export type ConsultationItem = 
  | { type: 'single'; data: Appointment; nextDate: Date }
  | { type: 'periodic'; data: RecurrencePattern; nextDate: Date };

export interface RecurrencePattern {
  id: string;
  therapistId: string;
  patientId: string;
  patientName: string;
  
  type: 'weekly'; 
  daysOfWeek: string[]; 
  time: Timestamp; 
  durationMinutes: number;
  
  status: 'active' | 'cancelled' | 'finished';
  startDate: Timestamp;
  lastGeneratedDate: Timestamp; 
  createdAt: Timestamp;
}

export interface Appointment {
  id: string;
  therapistId: string;
  patientId: string;
  patientName: string;
  
  date: Timestamp;
  durationMinutes: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  patternId?: string; 
  createdAt: Timestamp;
}

export interface CreateAppointmentDTO {
  patientId: string;
  patientName: string;
  
  date: Date;
  time: Date;
  durationMinutes: number;
  recurrence: RecurrenceType; 
  selectedDays: string[];
  endCondition: EndConditionType; 
  repeatWeeks: string;
}