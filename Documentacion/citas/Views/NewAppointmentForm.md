
**Ubicación**: `src/features/appointments/components/AppointmenstForm.tsx` (Exportado como `NewAppointmentForm`)

## Descripción
Formulario complejo para la creación y edición de citas. Utiliza `FloatingFormContainer` y gestiona tanto citas únicas como programación de tratamientos recurrentes. Integra validaciones y lógica de estado mediante un hook interno.

## Props

| Propiedad | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `visible` | `boolean` | Sí | Controla la visibilidad del modal del formulario. |
| `onClose` | `() => void` | Sí | Callback para cerrar el formulario (limpia el estado). |
| `onSuccess` | `() => void` | No | Callback invocado tras guardar exitosamente (crear o editar). |
| `onOpenPatientForm` | `() => void` | No | Callback para abrir el formulario de creación de paciente si no existe. |
| `initialData` | `ConsultationItem \| null` | No | Si se provee, el formulario entra en **Modo Edición** precargando los datos. |

## Ejemplo de uso

```tsx
import { NewAppointmentForm } from '@/features/appointments/components/AppointmenstForm';

// ...

<NewAppointmentForm
  visible={isFormVisible}
  onClose={() => setIsFormVisible(false)}
  onSuccess={() => {
    setIsFormVisible(false);
    refreshList();
  }}
  onOpenPatientForm={() => navigation.navigate('CreatePatient')}
  // Si es null, el formulario estará limpio (Modo Crear)
  // Si tiene datos, los cargará (Modo Editar)
  initialData={itemToEdit} 
/>
```

## Características Principales

### 1. Selección de Paciente
- Uso de `OptionSelector` con búsqueda integrada.
- Acceso directo para crear nuevo paciente si no existe.

### 2. Configuración de Fecha y Hora
- `DatePicker` dual para fecha y hora.
- Input numérico para duración en minutos.

### 3. Selector de Modalidad (Recurrencia)
- `SegmentedControl` para alternar entre "Consulta Única" y "Tratamiento".

### 4. Lógica de Tratamiento (Recurrente)
Se activa solo si la modalidad es "Tratamiento":
- **Selector de Días**: Interfaz de botones toggle para Lunes-Domingo.
- **Condición de Finalización**:
  - **Semanas**: Input numérico para definir duración del tratamiento (ej: 10 semanas).
  - **Manual**: "Hasta cancelar" (Indefinido).
