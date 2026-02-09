

Componente de interfaz de usuario que renderiza un botón de acción flotante (FAB) utilizado para acciones principales en la pantalla.

## Características
- Se posiciona automáticamente en la esquina inferior derecha.
- Diseño circular con sombra para elevación visual.
- Soporta iconos personalizados de la librería Ionicons.
- Proporciona retroalimentación visual al ser presionado.

## Props

| Propiedad  | Tipo                             | Requerido | Valor por defecto | Descripción                                                 |
| ---------- | -------------------------------- | --------- | ----------------- | ----------------------------------------------------------- |
| `onPress`  | `() => void`                     | Sí        | -                 | Función que se ejecuta cuando el usuario presiona el botón. |
| `iconName` | `keyof typeof Ionicons.glyphMap` | No        | `'add'`           | Nombre del icono de la librería Ionicons a mostrar.         |

## Ejemplo de uso

```tsx
import { FloatingButton } from '@/components/ui/FloatingButton';

// Uso básico (icono por defecto 'add')
<FloatingButton onPress={() => handleCreate()} />

// Uso con icono personalizado para búsqueda
<FloatingButton 
    onPress={() => handleSearch()} 
    iconName="search" 
/>
```
