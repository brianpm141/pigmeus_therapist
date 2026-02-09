# SettingItem

Componente de lista para opciones de configuración de la aplicación. Puede funcionar como un botón navegable o como un control interruptor (Switch).

## Características
- Muestra un icono a la izquierda con fondo coloreado.
- Título principal con estilo adaptable (claro/oscuro).
- Elemento derecho personalizable (por defecto un chevron, pero puede ser un Switch o cualquier otro elemento).
- Muestra el valor seleccionado si se proporciona.
- Interactividad configurable mediante `onPress`.

## Props

| Propiedad      | Tipo                                        | Requerido | Valor por defecto     | Descripción                                                                              |
| -------------- | ------------------------------------------- | --------- | --------------------- | ---------------------------------------------------------------------------------------- |
| `iconName`     | `string` (MaterialIcons)                    | Sí        | -                     | Nombre del icono de MaterialIcons a mostrar a la izquierda.                              |
| `title`        | `string`                                    | Sí        | -                     | Texto principal de la opción.                                                            |
| `value`        | `string`                                    | No        | -                     | Valor actual de la configuración (se muestra en texto gris a la derecha).                |
| `onPress`      | `() => void`                                | No        | -                     | Función a ejecutar al presionar el ítem.                                                 |
| `rightElement` | `React.ReactNode`                           | No        | `<MaterialIcons ...>` | Elemento personalizado a mostrar a la derecha. Si no se define, muestra Chevron Right.  |

## Ejemplo de uso

### Básico (Navegación)
```tsx
import { SettingItem } from "@/components/ui/SettingItem";

<SettingItem 
  iconName="language" 
  title="Idioma" 
  value="Español"
  onPress={() => console.log('Cambiar idioma')}
/>
```

### Con Switch (Modo Oscuro)
```tsx
import { Switch } from "react-native";
import { SettingItem } from "@/components/ui/SettingItem";

<SettingItem 
  iconName="brightness-4" 
  title="Modo Oscuro" 
  rightElement={
    <Switch
      value={isDark}
      onValueChange={toggleTheme}
    />
  }
/>
```
