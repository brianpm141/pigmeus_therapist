# Settings Screen

**Ubicación**: `app/(tabs)/settings.tsx`

## Descripción
Panel de control para la configuración de la aplicación y perfil del usuario.

## Características
1. **Tarjeta de Perfil**:
   - Muestra foto (con fallback a asset local por defecto), nombre y rol.
   - Estadísticas rápidas (Pacientes, Sesiones Anuales) usando `StatCard`.
   - Botón para editar perfil (abre modal flotante).
2. **Configuración General**:
   - **Modo Oscuro**: Switch para alternar tema `dark`/`light`.
   - **Idioma**: Switch para alternar Español/Inglés.
3. **Selector de Tema Dinámico**:
   - Lista de colores disponibles en `THEME_PALETTE`.
   - Al seleccionar, actualiza instantáneamente los colores primarios de toda la app.
4. **Cerrar Sesión**: Botón para desconectar la cuenta.

## Componentes Utilizados
- `SettingItem`: Para las filas de configuración.
- `FloatingFormContainer`: Para el modal de edición de perfil.
- `EditProfileForm`: Formulario inyectado en el modal.
- `StatusModal`: Feedback tras guardar cambios.
