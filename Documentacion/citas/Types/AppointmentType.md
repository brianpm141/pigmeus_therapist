# Appointment Interface

**Ubicación**: `src/types/appointments.ts`

## Descripción
Define las estructuras de datos para el manejo de Citas y Recurrencias. El sistema maneja dos conceptos clave: Citas Individuales (single) y Patrones de Recurrencia (periodic).

## Definiciones Principales

### `ConsultationItem`
Discriminated Union que unifica el manejo de una Cita o un Patrón en listas.
```typescript
export type ConsultationItem = 
  | { type: 'single'; data: Appointment; nextDate: Date }
  | { type: 'periodic'; data: RecurrencePattern; nextDate: Date };
```

### `Appointment`
Representa una instancia concreta de una cita en el calendario.
```typescript
export interface Appointment {
  id: string;
  therapistId: string;
  patientId: string;
  patientName: string;
  
  date: Timestamp;          // Fecha y Hora de la cita
  durationMinutes: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;           // Notas breves
  patternId?: string;       // ID del patrón padre si es recurrente
  createdAt: Timestamp;
}
```

### `RecurrencePattern`
Configuración maestra para citas que se repiten.
```typescript
export interface RecurrencePattern {
  id: string;
  therapistId: string;
  patientId: string;
  patientName: string;
  
  type: 'weekly';           // Por ahora solo semanal
  daysOfWeek: string[];     // IDs de días: 'L', 'M1', etc.
  time: Timestamp;          // Hora base para las repeticiones
  durationMinutes: number;
  
  status: 'active' | 'cancelled' | 'finished';
  startDate: Timestamp;     // Desde cuándo aplica aplica
  lastGeneratedDate: Timestamp; // Fecha hasta donde se han creado instancias
  createdAt: Timestamp;
}
```

## DTOs

### `CreateAppointmentDTO`
Objeto de transferencia para crear o editar citas.
```typescript
export interface CreateAppointmentDTO {
  patientId: string;
  patientName: string;
  
  date: Date;
  time: Date;
  durationMinutes: number;
  recurrence: 'single' | 'program'; 
  selectedDays: string[];
  endCondition: 'weeks' | 'manual'; 
  repeatWeeks: string;
}
```
