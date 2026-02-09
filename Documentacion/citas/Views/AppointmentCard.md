# AppointmentCard

**Ubicación**: `src/features/appointments/components/AppointmentCard.tsx`

## Descripción
Tarjeta de resumen utilizada en el listado principal de "Próximas Sesiones". Muestra información clave de la cita de manera compacta y diferencia visualmente entre citas únicas y tratamientos recurrentes.

## Props

| Propiedad | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `item` | `ConsultationItem` | Sí | Objeto unificado que puede ser una Cita (`single`) o un Patrón (`periodic`). |
| `onCancel` | `(id: string, isPattern: boolean) => void` | Sí | Callback para iniciar el flujo de cancelación. Recibe el ID y si es patrón. |
| `onPress` | `() => void` | No | Callback al presionar cualquier parte de la tarjeta (excepto el botón cancelar). |

### Interfaz ConsultationItem
Ver [[AppointmentType]] para más detalles.

## Ejemplo de uso

```tsx
import { AppointmentCard } from '@/features/appointments/components/AppointmentsComponents';
import { ConsultationItem } from '@/types/appointments';

// ... dentro de un FlatList o Map

const renderItem = ({ item }: { item: ConsultationItem }) => (
  <AppointmentCard
    item={item}
    onPress={() => handleOpenDetail(item)}
    onCancel={(id, isPattern) => {
        Alert.alert("Confirmar", "¿Cancelar cita?", [
            { text: "Sí", onPress: () => confirmCancel(id, isPattern) }
        ])
    }}
  />
);
```

## Características Visuales
- **Hora Destacada**: Muestra la hora de la próxima sesión en grande.
- **Badge de Tipo**:
  - **Recurrente**: Color Verde (`bg-green-100`), icono de repetición.
  - **Única**: Color Azul (`bg-blue-50`), icono de evento.
- **Detalles Contextuales**:
  - Si es recurrente: Muestra los días de la semana (ej: "Lun, Mié") y semanas restantes.
  - Si es única: Muestra la fecha completa y notas.
- **Acción Rápida**: Botón circular para cancelar directamente desde la lista.
