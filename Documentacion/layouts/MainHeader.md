# MainHeader

Encabezado principal de la aplicación que muestra la información del terapeuta logueado.

## Características
- Muestra la foto de perfil del terapeuta (o avatar por defecto si no existe).
- Nombre del terapeuta obtenido dinámicamente desde el hook `useTherapistProfile`.
- Borde de la foto coloreado según el tema actual (`colors.primary`).
- Botón de notificaciones con indicador de estado (punto rojo).

## Props
Este componente **no recibe props**. Se conecta automáticamente a los contextos globales:
- `useTherapistProfile`: Para obtener datos del usuario (nombre, foto).
- `useTheme`: Para obtener el color primario del tema para bordes e iconos.

## Ejemplo de uso

```tsx
import { MainHeader } from "@/components/layout/MainHeader";

// Usado comúnmente en el Layout principal de la app
export default function TabLayout() {
  return (
    <View className="flex-1">
        <MainHeader />
        {/* Contenido de la pantalla */}
        <Slot />
    </View>
  );
}
```

## Dependencias
- `@/features/auth/hooks/useTherapistProfile`: Hook para datos del usuario.
- `@/core/ThemeContext`: Hook para sistema de temas.
