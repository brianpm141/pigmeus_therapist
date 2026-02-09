

Selector de fecha adaptativo que utiliza los componentes nativos de cada plataforma para garantizar una experiencia de usuario familiar y optimizada.

## Características
- **Interfaz Nativa**: Despliega el calendario nativo en Android y un selector modal tipo "spinner" en iOS.
- **Trigger Personalizable**: Muestra la fecha seleccionada en un campo con estilo unificado a los inputs de texto.
- **Formato Automático**: Formatea la visualización de la fecha al formato local (dd/MM/yyyy).
- **Manejo de Tema**: Estilos compatibles automáticos tanto para modo claro como oscuro.
- **Validación**: Soporte para estados de error y fechas mínimas/máximas.

## Props

| Propiedad     | Tipo                   | Requerido | Valor por defecto     | Descripción                                       |
| ------------- | ---------------------- | --------- | --------------------- | ------------------------------------------------- |
| `label`       | `string`               | No        | -                     | Texto descriptivo encima del campo.               |
| `value`       | `Date`                 | No        | -                     | Objeto fecha seleccionado actualmente.            |
| `onChange`    | `(date: Date) => void` | Sí        | -                     | Función callback llamada al confirmar una fecha.  |
| `placeholder` | `string`               | No        | `'Seleccionar fecha'` | Texto a mostrar cuando no hay fecha seleccionada. |
| `error`       | `string`               | No        | -                     | Mensaje de error (marca el borde en rojo).        |
| `minimumDate` | `Date`                 | No        | -                     | Fecha mínima seleccionable.                       |
| `maximumDate` | `Date`                 | No        | -                     | Fecha máxima seleccionable.                       |
| `disabled`    | `boolean`              | No        | `false`               | Deshabilita la interacción con el campo.          |

## Ejemplo de uso

```tsx
import { DatePicker } from '@/components/ui/UIComponents';
import { useState } from 'react';

const MyForm = () => {
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);

  return (
    <DatePicker
      label="Fecha de Nacimiento"
      value={birthDate}
      onChange={setBirthDate}
      maximumDate={new Date()} // No permitir fechas futuras
      error={!birthDate ? "La fecha es obligatoria" : undefined}
    />
  );
};
```
