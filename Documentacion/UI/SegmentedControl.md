

Control de selección segmentado que permite al usuario elegir una opción única entre un conjunto predefinido, similar a un grupo de radio buttons pero con apariencia de pestañas compactas.

## Características
- Visualización de opciones en un contenedor horizontal.
- Indicador visual claro (fondo blanco y sombra) para la opción seleccionada.
- Soporte para etiquetas (label) descriptivas.
- Animación suave y elevación en la selección activa.

## Props

| Propiedad  | Tipo                      | Requerido | Valor por defecto | Descripción                                                                            |
| ---------- | ------------------------- | --------- | ----------------- | -------------------------------------------------------------------------------------- |
| `label`    | `string`                  | No        | -                 | Texto descriptivo o título que aparece encima del control.                             |
| `options`  | `Option[]`                | Sí        | -                 | Arreglo de opciones a mostrar. Cada opción debe tener `label` y `value`.               |
| `value`    | `string`                  | Sí        | -                 | El valor de la opción actualmente seleccionada.                                        |
| `onChange` | `(value: string) => void` | Sí        | -                 | Callback que se ejecuta al seleccionar una nueva opción. Recibe el valor seleccionado. |

### Interfaz Option
```typescript
interface Option {
  label: string; // Texto a mostrar
  value: string; // Valor interno único
}
```

## Ejemplo de uso

```tsx
import { SegmentedControl } from "@/components/ui/UIComponents";
import { useState } from "react";

const MyScreen = () => {
    const [gender, setGender] = useState('female');

    const genderOptions = [
        { label: 'Femenino', value: 'female' },
        { label: 'Masculino', value: 'male' },
    ];

    return (
        <SegmentedControl
            label="Género"
            options={genderOptions}
            value={gender}
            onChange={setGender}
        />
    );
};
```
