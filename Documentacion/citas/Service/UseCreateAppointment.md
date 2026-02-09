# useCreateAppointment Hook

**Ubicación**: `src/features/appointments/hooks/useCreateAppointment.ts`

## Descripción
Hook "Controller" que gestiona toda la lógica del formulario de citas (`NewAppointmentForm`). Maneja el estado local de múltiples campos, validaciones de negocio y la comunicación con el `AppointmentService`.

## Firma
```typescript
const { form, actions, ui } = useCreateAppointment(
  onSuccess?: () => void, 
  initialData?: ConsultationItem | null
);
```

## Estructura de Retorno

### `form` (State Getters & Setters)
Acceso directo a los valores del formulario:
- `patientId`, `patientName`
- `date`, `time`, `duration`
- `recurrence` ('single' | 'program')
- `selectedDays` (Array de días para recurrencia)
- `endCondition` (Criterio de fin de tratamiento)

### `actions` (Métodos)
- `toggleDay(dayId)`: Logica para seleccionar/deseleccionar días de recurrencia.
- `submit()`: Valida y envía el formulario (Crear o Actualizar).
- `resetForm()`: Limpia todos los campos.

### `ui` (Estado Visual)
- `isSubmitting`: Booleano para feedback de carga.
- `errors`: Objeto con mensajes de error de validación.

## Comportamiento
- **Modo Edición Automático**: Si se pasa `initialData`, el hook detecta si es una cita única o un patrón y autocompleta los estados correspondientes, normalizando las diferencias de estructura de datos entre ambos tipos.
- **Validación Centralizada**: Antes de llamar al servicio, verifica campos requeridos y reglas de negocio (ej: al menos un día seleccionado si es recurrente).
