
**Ubicación**: `src/features/appointments/components/AppointmentDetail.tsx`

## Descripción
Modal tipo slide-up (`FloatingFormContainer`) que muestra la información detallada de una cita o tratamiento.

## Props

| Propiedad | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `visible` | `boolean` | Sí | Controla la visibilidad del modal. |
| `item` | `ConsultationItem \| null` | Sí | El objeto de cita o patrón a visualizar. Si es null, no renderiza nada. |
| `onClose` | `() => void` | Sí | Callback para cerrar el modal. |
| `onEdit` | `() => void` | Sí | Callback ejecutado al presionar el botón "Editar". |
| `onDelete` | `() => void` | Sí | Callback ejecutado al presionar el botón "Cancelar/Detener". |

## Ejemplo de uso

```tsx
import { AppointmentDetail } from '@/features/appointments/components/AppointmentsComponents';

// ...

<AppointmentDetail
  visible={isDetailVisible}
  item={selectedItem}
  onClose={() => setIsDetailVisible(false)}
  onEdit={() => {
    setIsDetailVisible(false);
    openEditForm(selectedItem);
  }}
  onDelete={() => {
    handleDelete(selectedItem);
  }}
/>
```

## Estructura de Información
1. **Encabezado Grande**: Hora de la cita en tipografía `text-5xl`.
2. **Badge de Estado**: Indica claramente si es "Consulta Única" o "Tratamiento Recurrente".
3. **Sección Paciente**: Nombre destacado del paciente.
4. **Sección Planificación**:
   - **Frecuencia**: Semanal o fecha específica.
   - **Días**: Lista de días activos (traducidos).
   - **Próximas Sesiones**: (Solo recurrente) Lista calculada de las siguientes 3 fechas futuras reales.
5. **Acciones**:
   - **Editar**: Abre el formulario en modo edición.
   - **Eliminar/Detener**: Botón de peligro para cancelar la cita o detener el tratamiento.
