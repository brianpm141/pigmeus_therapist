
Botón versátil utilizado para acciones principales, secundarias y de peligro en formularios y pantallas. Soporta múltiples variantes visuales y estados de carga.

## Características
- **Múltiples Variantes**: Soporta estilos `primary`, `outline`, `ghost` y `danger` para diferentes jerarquías visuales.
- **Estado de Carga**: Muestra un indicador de actividad (`ActivityIndicator`) y deshabilita la interacción automáticamente.
- **Iconos**: Permite la integración de iconos (React Elements) junto al texto.
- **Feedback Táctil**: Reduce la opacidad al ser presionado.
- **Consistencia**: Utiliza la tipografía y colores del sistema de diseño.

## Props

| Propiedad   | Tipo                                            | Requerido | Valor por defecto | Descripción                                                 |
| ----------- | ----------------------------------------------- | --------- | ----------------- | ----------------------------------------------------------- |
| `title`     | `string`                                        | Sí        | -                 | Texto a mostrar dentro del botón.                           |
| `onPress`   | `() => void`                                    | Sí        | -                 | Función a ejecutar al presionar el botón.                   |
| `variant`   | `'primary' \| 'outline' \| 'ghost' \| 'danger'` | No        | `'primary'`       | Estilo visual del botón.                                    |
| `icon`      | `React.ReactNode`                               | No        | -                 | Elemento de icono a mostrar a la izquierda del texto.       |
| `isLoading` | `boolean`                                       | No        | `false`           | Si es true, muestra un spinner y deshabilita el botón.      |
| `disabled`  | `boolean`                                       | No        | `false`           | Deshabilita la interacción y reduce la opacidad.            |
| `className` | `string`                                        | No        | -                 | Clases adicionales de Tailwind para estilos personalizados. |

## Ejemplo de uso

```tsx
import { FormButton } from '@/components/ui/UIComponents';
import { MaterialIcons } from '@expo/vector-icons';

// Botón Primario
<FormButton 
    title="Guardar Cambios" 
    onPress={handleSubmit} 
/>

// Botón con Icono y Estado de Carga
<FormButton 
    title="Enviar" 
    variant="primary"
    icon={<MaterialIcons name="send" size={20} color="white" />}
    isLoading={isSubmitting}
    onPress={handleSend}
/>

// Botón de Peligro (Eliminar)
<FormButton 
    title="Eliminar Cuenta" 
    variant="danger" 
    onPress={handleDelete} 
/>
```
