# AppointmentService (Métodos para Agenda)

**Ubicación**: `src/services/appointmentService.ts`

## Descripción
Servicio centralizado para gestionar citas y patrones de recurrencia en Firestore. Expone métodos para crear, actualizar, cancelar y eliminar tanto citas individuales como programas recurrentes. En el contexto del Calendario/Agenda, los métodos clave son aquellos que permiten visualizar y administrar la agenda diaria.

## Métodos Principales para Agenda

### getAllAppointmentsForAgenda()
Obtiene todas las citas programadas para mostrar en la vista de agenda (grid de horarios).

#### Firma
```typescript
getAllAppointmentsForAgenda: async (therapistId: string) => {
  appointments: Appointment[]
}
```

#### Comportamiento
- Consulta la colección `appointments` en Firestore
- Filtra por:
  - `therapistId` del terapeuta actual
  - `status === 'scheduled'` (excluye completadas y canceladas)
  - `date >= now()` (solo citas futuras)
- Ordena por fecha ascendente
- Límite de 100 citas
- **Diferencia clave con `getActiveConsultations`**: NO filtra por `patternId`, devuelve TODAS las citas (individuales y generadas desde patrones)

#### Uso
```typescript
const { appointments } = await AppointmentService.getAllAppointmentsForAgenda(profile.uid);
```

### update()
Actualiza una cita individual o un patrón de recurrencia completo.

#### Firma
```typescript
update: async (
  therapistId: string,
  id: string,
  currentType: 'single' | 'periodic',
  data: CreateAppointmentDTO
) => void
```

#### Comportamiento
- **Si es 'single'**: Actualiza directamente los campos de la cita (patientId, patientName, date, durationMinutes)
- **Si es 'periodic'**: 
  1. Actualiza el patrón maestro en `recurrence_patterns`
  2. ELIMINA todas las citas futuras generadas desde ese patrón
  3. REGENERA las citas futuras con la nueva configuración

### cancelAppointment()
Marca una cita individual como cancelada.

#### Firma
```typescript
cancelAppointment: async (appointmentId: string) => void
```

#### Comportamiento
- Actualiza el documento en `appointments` cambiando `status` a `'cancelled'`
- NO elimina el documento, solo lo marca como cancelado

#### Uso en Agenda
```typescript
await AppointmentService.cancelAppointment(appointmentId);
```

### deleteAppointment()
Elimina permanentemente una cita individual.

#### Firma
```typescript
deleteAppointment: async (appointmentId: string) => void
```

#### Comportamiento
- Elimina el documento de la colección `appointments`
- Acción irreversible

## Otros Métodos Relacionados

### cancelPattern()
Marca un patrón de recurrencia como cancelado (no genera más citas).

### deletePattern()
Elimina un patrón de recurrencia y TODAS sus citas asociadas (presentes y futuras).

### create()
Crea una nueva cita individual o un patrón de recurrencia con sus citas derivadas.

## Notas de Implementación
- **Batched Writes**: Las operaciones que afectan múltiples documentos (crear/actualizar patrones) usan `writeBatch` para garantizar atomicidad
- **DAY_MAP**: Mapeo interno de días de la semana (`'L' => 1`, `'M1' => 2`, etc.) para calcular fechas de recurrencia
- **INITIAL_HORIZON_WEEKS**: Constante que define cuántas semanas adelante se generan las citas de un patrón sin fecha de fin (default: 26)
