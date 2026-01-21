# TextArea

Campo de texto multilínea diseñado para entradas de texto extenso, como descripciones, notas o comentarios, manteniendo la consistencia visual con el resto de los componentes.

## Características
- **Altura Mínima**: Altura base garantizada para facilitar la escritura de párrafos.
- **Alineación Superior**: El texto comienza desde la esquina superior izquierda (crucial en Android).
- ** Estilos Unificados** : Comparte el lenguaje de diseño (bordes redondeados, colores, fuentes) con los componentes `Input`.
- **Validación Integrada**: Soporte visual para mensajes de error.
- **Adaptable**: Soporta todas las propiedades nativas de `TextInput` y estilos personalizados.

## Props

Este componente extiende `TextInputProps` de React Native, por lo que acepta todas sus propiedades.

| Propiedad   | Tipo             | Requerido | Valor por defecto | Descripción                                                                           |
| ----------- | ---------------- | --------- | ----------------- | ------------------------------------------------------------------------------------- |
| `label`     | `string`         | No        | -                 | Título o etiqueta descriptiva sobre el área de texto.                                 |
| `error`     | `string`         | No        | -                 | Mensaje de error a mostrar debajo del componente. Cambia el borde a color de peligro. |
| `className` | `string`         | No        | -                 | Clases de estilo adicionales (Tailwind) para el contenedor del input.                 |
| `...props`  | `TextInputProps` | No        | -                 | Propiedades estándar como `placeholder`, `onChangeText`, `value`, etc.                |

## Ejemplo de uso

```tsx
import { TextArea } from '@/components/ui/UIComponents';
import { useState } from 'react';

const NotesScreen = () => {
    const [notes, setNotes] = useState('');

    return (
        <TextArea
            label="Notas de la Consulta"
            placeholder="Escribe aquí los detalles..."
            value={notes}
            onChangeText={setNotes}
            numberOfLines={4}
        />
    );
};
```
