# TimeSlotGrid Component

**Ubicación**: `src/components/layout/TimeSlotGrid.tsx`

## Descripción
Componente que renderiza una grilla vertical de horarios (slots) de 24 horas divididos en intervalos de 60 minutos. Muestra las citas programadas y espacios disponibles, permitiendo agregar nuevas citas al clickear en los slots libres.

## Props
```typescript
interface TimeSlotGridProps {
  selectedDate: Date;
  appointments: Appointment[];
  onAddAppointment: (date: Date) => void;
  onCardPress: (id: string) => void;
  onAccept: (id: string) => void;
  onCancel: (id: string) => void;
}
```

### Parámetros
- **selectedDate**: Fecha del día que se está mostrando
- **appointments**: Array de citas para ese día
- **onAddAppointment**: Callback para abrir formulario de nueva cita en un slot específico
- **onCardPress**: Callback para abrir detalle de cita al tocar una tarjeta
- **onAccept**: Callback para marcar cita como completada
- **onCancel**: Callback para cancelar una cita

## Funcionamiento

### Generación de Slots
- Genera 24 slots de 60 minutos cada uno (00:00 a 23:00)
- Usa `date-fns` para crear los timestamps de cada hora
- Los slots se recalculan cuando cambia `selectedDate` (useMemo)

### Normalización de Horarios
Dado que las citas pueden empezar en minutos arbitrarios (ej: 10:23 AM), el grid normaliza los horarios:
- **getNormalizedStart()**: Redondea hacia abajo a la hora completa (10:23 → 10:00)
- **getNormalizedEnd()**: Redondea hacia arriba a la siguiente hora completa (10:23 + 60min → 12:00)

Esto permite que las citas ocupen slots completos sin superposiciones visuales.

### Lógica de Ocupación
1. **Detección**: Para cada slot, busca si hay una cita que normalizada empiece en esa hora
2. **Renderizado Condicional**:
   - Si hay cita: Renderiza `AppointmentCard` con horarios de inicio/fin
   - Si está libre: Renderiza botón "Espacio disponible" con icono `+`
3. **Bloqueo de Slots**: Una vez renderizada una cita, marca como ocupados todos los slots que cubre su duración para evitar duplicados

### Auto-scroll al Horario Actual
Si el día seleccionado es HOY:
- Calcula el slot correspondiente a la hora actual
- Hace scroll automático 3 horas antes de la hora actual (para contexto)
- Si es otro día, scroll al inicio

## Estructura Visual
```
[Hora] [Contenido]
10:00  ┌─────────────────────┐
   |   │  AppointmentCard    │
   ├   │  (si hay cita)      │
11:00  └─────────────────────┘

12:00  ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
       │ + Espacio disponible│ <- onAddAppointment(12:00)
       └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

## Optimización
- Control de duplicados con `Set<string>` para IDs de citas ya renderizadas
- Control de ocupación con `Set<number>` para timestamps de slots bloqueados
- ScrollView con `ref` para scroll programático

## Uso
```typescript
<TimeSlotGrid 
  selectedDate={selectedDate}
  appointments={currentDayAppointments}
  onAddAppointment={handleOpenCreate}
  onCardPress={handleOpenDetail}
  onAccept={handleAccept}
  onCancel={handleCancel}
/>
```

## Notas de Diseño
- La duración default de citas es 60 minutos si no se especifica
- Los estilos se adaptan a modo claro/oscuro
- Usa traducciones via i18next para textos como "Espacio disponible"
