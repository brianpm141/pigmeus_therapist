# ThemeContext

**Ubicación**: `src/core/ThemeContext.tsx`

## Descripción
El núcleo del sistema de personalización visual. Provee no solo el contexto de React para componentes, sino que también inyecta variables CSS dinámicas para que Tailwind funcione con colores cambiantes en tiempo de ejecución.

## Paleta de Colores (`THEME_PALETTE`)
Colección de temas predefinidos accesibles por nombre clave:
- `ocean`: Azul (#38bdf8)
- `mint`: Verde (#34d399)
- `lavender`: Morado (#a78bfa)
- `rose`: Rosa (#f472b6)
- `coral`: Naranja (#fb923c)
- `slate`: Gris (#94a3b8)

Cada tema define:
- `primary`: Color principal.
- `dark`: Variante oscura para hover/active.
- `soft`: Versión con baja opacidad para fondos sutiles.
- `bg`: Color de fondo muy suave.

## Integración con NativeWind (Tailwind)
El Provider utiliza `vars` de `nativewind` para inyectar variables CSS en el `View` raíz de la aplicación: Set de variables:
- `--color-primary`
- `--color-primary-dark`
- `--color-primary-soft`    
Esto permite usar clases como `bg-primary` o `text-primary` en cualquier componente y que respondan automáticamente al cambio de tema sin re-renderizados complejos.

## Persistencia
El tema seleccionado se guarda en `AsyncStorage` bajo la clave `@pigmeus_theme_color` para persistir entre sesiones.
