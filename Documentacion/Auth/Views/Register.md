# Register Screen

**Ubicación**: `app/(auth)/register.tsx`

## Descripción
Pantalla de registro para nuevos terapeutas. Recopila información básica y credenciales para crear la cuenta.

## Características
- **Campos**: Nombre, Apellido, Fecha Nacimiento, Email, Password, Confirmación.
- **Validaciones**:
  - Campos vacíos.
  - Coincidencia de contraseñas.
  - Formato de email (validación nativa del input).
  - Aceptación de términos y privacidad.
- **DatePicker**: Uso del componente `DatePicker` estandarizado para la fecha de nacimiento.
- **Feedback**: Mensajes de error específicos traducidos (i18n).

## Flujo de Registro
1. Usuario completa formulario.
2. Se llama a `AuthService.register()`.
3. Se crea usuario en Firebase Auth y documento en Firestore.
4. El sistema redirige automáticamente al Dashboard.
