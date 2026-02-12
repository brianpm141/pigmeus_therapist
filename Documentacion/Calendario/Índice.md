# Documentación de Calendario/Agenda

## Arquitectura

### Tipos de Datos
- **[[ConsultationItemType]]**: Tipo discriminado para manejar citas individuales y patrones recurrentes de forma unificada

### Lógica de Negocio (Servicio)
- **[[AppointmentService]]**: Métodos para gestionar citas en Firestore (específicamente `getAllAppointmentsForAgenda()`)
- **[[UseTherapistProfile]]**: Hook para acceder al perfil del terapeuta autenticado

## Componentes de UI

### Navegación y Visualización
- **[[DateStrip]]**: Tira horizontal de selección de fechas
- **[[TimeSlotGrid]]**: Grid de 24 horas con slots horarios y citas
- **[[AppointmentCardCalendar]]**: Tarjeta de cita optimizada para el calendario

### Pantalla Principal
- **[[AgendaScreen]]**: Integración completa del calendario con modales de detalle y formulario

## Flujo de Trabajo

1. **Navegación**: Usuario selecciona una fecha en `DateStrip`
2. **Visualización**: `TimeSlotGrid` muestra las citas del día en slots horarios
3. **Interacción**: Al tocar una cita, se abre `AppointmentDetail` (documentado en módulo Citas)
4. **Edición**: Desde el detalle se puede abrir `NewAppointmentForm` (documentado en módulo Citas)
5. **Acciones Rápidas**: Confirmar o cancelar citas directamente desde las tarjetas

## Relación con Otros Módulos
- **Citas**: Comparte los modales `AppointmentDetail` y `NewAppointmentForm`
- **Auth**: Usa `useTherapistProfile` para identificar al terapeuta
- **Pacientes**: Las citas contienen referencia a pacientes (patientId, patientName)
