# AppointmentCard (Versión Calendario)

**Ubicación**: `src/features/calendar/components/AppointmentCard.tsx`

## Descripción
Tarjeta visual que muestra la información de una cita dentro del grid de horarios del calendario. Incluye estado, paciente, hora, duración y acciones rápidas (confirmar/cancelar) si la cita está pendiente.

## Props
```typescript
export interface AppointmentCardProps {
  appointment: Appointment;
  patientPhone?: string;
  treatmentName?: string;
  onAccept: (id: string) => void;
  onCancel: (id: string) => void;
  onPressCard: (id: string) => void;
}
```

### Parámetros
- **appointment**: Objeto `Appointment` con la información de la cita
- **patientPhone**: (Opcional) Teléfono del paciente
- **treatmentName**: (Opcional) Nombre del tratamiento (default: "Consulta General")
- **onAccept**: Callback para marcar la cita como completada
- **onCancel**: Callback para cancelar la cita
- **onPressCard**: Callback al tocar la tarjeta (abre detalle)

## Estados Visuales

### Scheduled (Pendiente)
- **Color**: Naranja (`border-orange-200`, `bg-orange-50`)
- **Badge**: "PENDIENTE"
- **Acciones**: Muestra botones Aceptar y Cancelar

### Completed (Confirmado)
- **Color**: Verde (`border-status-success`, `bg-status-success-soft`)
- **Badge**: "CONFIRMADO"
- **Acciones**: No muestra botones

### Cancelled (Cancelado)
- **Color**: Rojo (`border-status-danger`, `bg-status-danger-soft`)
- **Badge**: "CANCELADO"
- **Acciones**: No muestra botones

## Información Mostrada
1. **Encabezado**:
   - Nombre del paciente (truncado a 1 línea)
   - Badge de estado
2. **Detalles**:
   - Hora de inicio y duración (ej: "10:30 AM (60 min)")
   - Teléfono del paciente o mensaje "Sin contacto"
3. **Tratamiento**: Nombre del tratamiento (debajo del paciente)
4. **Acciones** (solo si status === 'scheduled'):
   - Botón "Aceptar" (fondo blanco, texto primary)
   - Botón "X" rojo (cancela la cita)

## Eventos
- **onPressCard**: Al tocar cualquier parte de la tarjeta (excepto botones de acción)
- **onAccept/onCancel**: Usan `stopPropagation()` para evitar que se dispare `onPressCard`

## Diferencias con AppointmentCard de Citas
Esta versión está optimizada para el calendario:
- Más compacta verticalmente
- Menos información de tratamiento
- Enfocada en el estado visual (colores y badges más prominentes)
- Bordes laterales de color para identificación rápida

## Uso
```typescript
<AppointmentCard 
  appointment={appointment}
  onPressCard={(id) => handleOpenDetail(id)}
  onAccept={(id) => handleAccept(id)}
  onCancel={(id) => handleCancel(id)}
/>
```

## Traducciones (i18next)
- `appointments.singleConsultation`: "Consulta General"
- `appointmentStatus.scheduled`: "PENDIENTE"
- `appointmentStatus.confirmed`: "CONFIRMADO"
- `appointmentStatus.cancelled`: "CANCELADO"
- `data.noPhone`: "Sin contacto"
- `actions.confirm`: "Aceptar"
