

Componente de selección desplegable avanzado que soporta búsqueda, iconos/iniciales, subtítulos y creación de nuevas opciones. Diseñado para ofrecer una mejor experiencia que un `Picker` nativo estándar.

## Características

- **Búsqueda Integrada**: Permite filtrar opciones escribiendo texto (toggle con icono de lupa).
- **Visualización Rica**: Muestra iniciales en un círculo coloreado y soporta subtítulos para cada opción.
- **Creación de Ítems**: Opción opcional para "Crear Nuevo" elemento si no se encuentra.
- **Validación**: Soporta estado de error con mensaje y borde rojo.
- **Teclado**: Manejo adecuado del teclado y scroll en la lista.

## Props

| Propiedad | Tipo | Requerido | Valor por defecto | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `label` | `string` | Sí | - | Etiqueta del campo mostrada encima del selector. |
| `options` | `Option[]` | Sí | - | Array de opciones disponibles. Ver interfaz `Option` abajo. |
| `selectedValue` | `string` | No | - | Valor (`value`) de la opción actualmente seleccionada. |
| `onSelect` | `(option: Option) => void` | Sí | - | Callback ejecutado al seleccionar una opción. |
| `onAddNew` | `() => void` | No | - | Callback para el botón de "Crear Nuevo". Si no se provee, no se muestra el botón. |
| `placeholder` | `string` | No | `"Seleccionar..."` | Texto a mostrar cuando no hay selección. |
| `error` | `string` | No | - | Mensaje de error a mostrar y activa el estado de error visual. |

### Interfaz Option

```typescript
interface Option {
  label: string;  
  value: string;  
  subtitle?: string; 
}
```

## Ejemplo de uso

```tsx
import { OptionSelector, Option } from '@/components/ui/OptionSelector';
import { useState } from 'react';

// ... dentro del componente

const [selectedPatient, setSelectedPatient] = useState<string>();

const patients: Option[] = [
  { label: 'Juan Pérez', value: '1', subtitle: 'ID: 12345' },
  { label: 'María García', value: '2', subtitle: 'ID: 67890' },
];

<OptionSelector
  label="Paciente"
  placeholder="Buscar paciente..."
  options={patients}
  selectedValue={selectedPatient}
  onSelect={(opt) => setSelectedPatient(opt.value)}
  onAddNew={() => router.push('/patients/new')}
  error={!selectedPatient ? 'Debe seleccionar un paciente' : undefined}
/>
```
