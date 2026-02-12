# ConsultationItem Type

**Ubicación**: `src/types/appointments.ts`

## Descripción
Tipo discriminado (union type) que representa un elemento en el tablero de citas. Permite manejar de forma unificada tanto citas individuales como patrones de recurrencia, facilitando su renderizado en listas y calendarios.

## Definición
```typescript
export type ConsultationItem = 
  | { type: 'single'; data: Appointment; nextDate: Date }
  | { type: 'periodic'; data: RecurrencePattern; nextDate: Date };
```

## Variantes

### Single (Cita Individual)
Representa una cita única programada en una fecha específica.
- **type**: `'single'`
- **data**: Objeto `Appointment` con todos los detalles de la cita
- **nextDate**: Fecha de la cita (para ordenamiento cronológico)

### Periodic (Patrón Recurrente)
Representa un patrón maestro de citas recurrentes (e.g., "Todos los lunes y miércoles a las 10 AM").
- **type**: `'periodic'`
- **data**: Objeto `RecurrencePattern` con la configuración de recurrencia
- **nextDate**: Próxima ocurrencia calculada dinámicamente

## Uso
Este tipo se utiliza principalmente en:
- **Tablero de Consultas** (`app/(tabs)/consultations.tsx`): Para renderizar la lista unificada de citas
- **Hook useConsultations**: Para combinar y ordenar citas individuales con recurrentes
- **Agenda Screen** (`app/(tabs)/index.tsx`): Para pasar datos entre modales de detalle y edición

## Tipos Relacionados

### Appointment
```typescript
export interface Appointment {
  id: string;
  therapistId: string;
  patientId: string;
  patientName: string;
  date: Timestamp;
  durationMinutes: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  patternId?: string; // Referencia al patrón si fue generada desde uno
  createdAt: Timestamp;
}
```

### RecurrencePattern
```typescript
export interface RecurrencePattern {
  id: string;
  therapistId: string;
  patientId: string;
  patientName: string;
  type: 'weekly';
  daysOfWeek: string[]; // ['Monday', 'Wednesday']
  time: Timestamp;
  durationMinutes: number;
  status: 'active' | 'cancelled' | 'finished';
  startDate: Timestamp;
  lastGeneratedDate: Timestamp;
  createdAt: Timestamp;
}
```

## Ventajas del Diseño
1. **Type Safety**: TypeScript garantiza que se maneje correctamente cada variante
2. **Código DRY**: Permite reutilizar componentes de renderizado (e.g., `AppointmentCard`)
3. **Ordenamiento Unificado**: El campo `nextDate` facilita ordenar cronológicamente ambos tipos
