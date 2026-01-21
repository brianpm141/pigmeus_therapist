
Campo de texto estandarizado que incluye etiqueta opcional, manejo de errores y estilos adaptables al tema (claro/oscuro).

## Características
- Muestra una etiqueta (label) descriptiva sobre el campo.
- Visualización de mensajes de error con estilos de validación (borde rojo y texto de ayuda).
- Soporte completo para todas las propiedades nativas de `TextInput` (keyboardType, secureTextEntry, etc.).
- Estilos responsivos que se adaptan al modo oscuro y claro automáticamente.

## Props

Este componente hereda todas las propiedades de `TextInputProps` de React Native.

| Propiedad   | Tipo             | Requerido | Valor por defecto | Descripción                                                                                          |
| ----------- | ---------------- | --------- | ----------------- | ---------------------------------------------------------------------------------------------------- |
| `label`     | `string`         | No        | -                 | Texto descriptivo que aparece encima del campo de entrada.                                           |
| `error`     | `string`         | No        | -                 | Mensaje de error. Si existe, cambia el color del borde a rojo y muestra el mensaje debajo del input. |
| `className` | `string`         | No        | -                 | Clases adicionales de Tailwind para personalizar el contenedor.                                      |
| `...props`  | `TextInputProps` | No        | -                 | Cualquier otra propiedad estándar del componente TextInput de React Native.                          |

## Ejemplo de uso

```tsx
import { Input } from "@/components/ui/Input";

// Uso básico con etiqueta
<Input
  label="Nombre del Paciente"
  placeholder="Ej: Juan Pérez"
  value={name}
  onChangeText={setName}
/>

// Uso con validación de error y contraseña
<Input
  label="Contraseña"
  placeholder="******"
  value={password}
  onChangeText={setPassword}
  secureTextEntry={true}
  error={errorMessage} // Si contiene texto, se muestra el estado de error
/>
```
