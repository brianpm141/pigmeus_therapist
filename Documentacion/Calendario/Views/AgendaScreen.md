# AgendaScreen (Pantalla Principal del Calendario)

**Ubicación**: `app/(tabs)/index.tsx`

## Descripción
Pantalla principal del calendario/agenda que integra los componentes `DateStrip`, `TimeSlotGrid`, `AppointmentDetail` y `NewAppointmentForm` para crear una experiencia completa de gestión de citas diarias.

## Estado Principal
```typescript
const [selectedDate, setSelectedDate] = useState<Date>(new Date());
const [appointments, setAppointments] = useState<Appointment[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [showDatePicker, setShowDatePicker] = useState(false);
const [isFormVisible, setIsFormVisible] = useState(false);
const [isDetailVisible, setIsDetailVisible] = useState(false);
const [editingItem, setEditingItem] = useState<ConsultationItem | null>(null);
```

## Flujo de Datos

### Carga de Citas
1. Hook `useTherapistProfile()` obtiene el UID del terapeuta
2. `fetchAppointments()` llama a `AppointmentService.getAllAppointmentsForAgenda()`
3. Filtra las citas del día seleccionado con `useMemo` (comparando fecha completa)
4. Actualiza en tiempo real al cambiar de pantalla (`useFocusEffect`)

### Navegación de Modales
El flujo de interacción con citas sigue este patrón:

```
Grid → Card Click → Detail Modal → Edit Button → Form Modal
                                  ↓ Delete
                                Cancel/Confirm
```

#### 1. Ver Detalle (handleOpenDetail)
- Usuario toca una tarjeta de cita en el grid
- Busca la cita completa por ID
- Crea un objeto `ConsultationItem` tipo 'single'
- Abre modal `AppointmentDetail`

#### 2. Editar desde Detalle (handleEditFromDetail)
- Usuario presiona "Editar" en el detalle
- Cierra modal de detalle
- Abre modal de formulario con el mismo `editingItem` (delay de 300ms para animación)

#### 3. Borrar desde Detalle (handleDelete FromDetail)
- Llama a `handleCancel()` para marcar como cancelada
- Cierra el modal de detalle

## Handlers

### handleAccept(id)
- Marca cita como completada (`status: 'completed'`)
- Actualiza via `AppointmentService.update()`
- Refresca la lista de citas

### handleCancel(id)
- Muestra alerta de confirmación
- Si confirma, llama a `AppointmentService.cancelAppointment()`
- Refresca la lista

### handleOpenCreate(dateOverride?)
- Limpia `editingItem` (modo creación)
- Si recibe una fecha (desde slot), la loggea (posible feature futura)
- Abre modal de formulario

## Componentes Integrados

### DateStrip
Navegación horizontal de fechas con selector de calendario nativo.

### TimeSlotGrid
Grid de horarios de 24 horas con citas y espacios disponibles.

### AppointmentDetail
Modal para ver detalles de una cita con opciones de editar/borrar.

### NewAppointmentForm
Modal con formulario para crear o editar citas.

### FloatingButton
Botón flotante (+) para agregar citas rápidas.

## Uso de RNDateTimePicker
Selector de fecha nativo (Android/iOS) que se abre al tocar el botón de calendario en el `DateStrip`.

## Notas de Diseño
- **Separación de responsabilidades**: Detalle modal (solo lectura) vs. Formulario (edición)
- **UX coherente**: El flujo visual es Card → Detail → Form (en lugar de ir directo a editar)
- **Estados controlados**: Todos los modales se controlan con flags booleanos separados
- **Filtrado optimizado**: Solo se pasan al grid las citas del día seleccionado para mejor performance
