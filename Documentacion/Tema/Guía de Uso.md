# Guía de Uso del Sistema de Temas

Esta aplicación utiliza un sistema de temas híbrido que combina **Tailwind CSS (NativeWind)** con **Contexto de React**.

## 1. Usando Clases de Tailwind (Recomendado)
Para la mayoría de los casos, simplemente usa las clases de utilidad alias que hemos configurado en `tailwind.config.js`. Estas apuntan a variables CSS dinámicas.

- `bg-primary`: Fondo con el color principal del tema seleccionado.
- `text-primary`: Texto con el color principal.
- `border-primary`: Borde con el color principal.
- `bg-primary/20`: Opacidad soportada nativamente.

**Ejemplo:**
```tsx
<View className="bg-primary p-4 rounded-xl">
  <Text className="text-white font-bold">Botón Temático</Text>
</View>
```
*Si el usuario cambia de "Ocean" a "Rose", este botón pasará de Azul a Rosa automáticamente.*

## 2. Usando el Hook `useTheme()`
Para casos donde Tailwind no alcanza (ej. props de componentes que requieren strings de color hexadecimal, como iconos de vectores o gradientes).

```tsx
import { useTheme } from '@/core/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';

const MiComponente = () => {
  const { colors, themeColor } = useTheme();

  return (
    // 'colors.primary' devuelve el string hexadecimal (ej: #38bdf8)
    <MaterialIcons name="home" size={24} color={colors.primary} />
  );
};
```

## 3. Añadiendo un Nuevo Tema
1. Abre `src/core/ThemeContext.tsx`.
2. Agrega una nueva entrada al objeto `THEME_PALETTE`:
   ```ts
   gold: {
     name: 'Oro',
     primary: '#facc15',
     dark: '#eab308',
     soft: 'rgba(250, 204, 21, 0.15)',
     // ...otros valores
   },
   ```
3. TypeScript inferirá automáticamente el nuevo tipo.
4. El selector de temas en `SettingsScreen` renderizará automáticamente la nueva opción.
