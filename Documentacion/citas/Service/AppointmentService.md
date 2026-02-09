
**Ubicación**: `src/services/appointmentService.ts`

## Descripción
Servicio centralizado para la gestión avanzada de citas. Maneja tanto operaciones CRUD simples como la lógica compleja de generación de recurrencias y regeneración de calendario ante ediciones.

## Métodos Principales

### `create(therapistId: string, data: CreateAppointmentDTO)`
- **Propósito**: Crea una nueva cita única o un patrón recurrente.
- **Lógica de Recurrencia**:
  - Si es recurrente (`program`), crea un documento `recurrence_pattern`.
  - Genera instancias `appointments` futuras basándose en los días seleccionados (`selectedDays`) y el horizonte de tiempo (`weeksToGenerate`).
  - Utiliza `batch` para asegurar atomicidad.

### `getActiveConsultations(therapistId: string)`
- **Propósito**: Obtiene la lista combinada para el dashboard.
- **Retorno**: `{ singleAppointments: Appointment[], patterns: RecurrencePattern[] }`
- **Estrategia**:
  1. Consulta `appointments` con status `scheduled` y fecha futura. Filtra en memoria las que NO tienen `patternId` (citas sueltas).
  2. Consulta `recurrence_patterns` con status `active`.
  3. El frontend combina ambas listas mediante la interfaz `ConsultationItem`.

### `update(therapistId, id, currentType, data)`
- **Propósito**: Edición inteligente tanto de citas únicas como recurrentes.
- **Flujo Recurrente (`periodic`)**:
  1. Actualiza el documento maestro `recurrence_pattern`.
  2. **Limpieza**: Elimina todas las citas futuras (`scheduled`) vinculadas a ese patrón.
  3. **Regeneración**: Vuelve a crear las citas futuras con la nueva configuración (hora, días, etc.), preservando el historial pasado.

### `deletePattern(patternId: string)`
- **Propósito**: Eliminación en cascada.
- **Acción**: Elimina el patrón y **todas** las citas asociadas (`patternId == id`).

## Hooks Relacionados

### `useCreateAppointment`
- **Ubicación**: `src/features/appointments/hooks/useCreateAppointment.ts`
- **Descripción**: Hook que encapsula la lógica de estado del formulario, validaciones y llamada al servicio. Maneja la transformación de datos entre la UI y el DTO.
