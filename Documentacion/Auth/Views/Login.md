# Login Screen

**Ubicación**: `app/(auth)/login.tsx`

## Descripción
Pantalla de inicio de sesión. Permite al terapeuta ingresar con sus credenciales o navegar al registro.

## Características
- **Formulario Validado**: Campos de email y contraseña.
- **Integración i18n**: Textos de error y placeholders traducidos.
- **Manejo de Errores**: Feedback visual en caso de credenciales inválidas.
- **Redirección Auth**: Al completarse el login exitoso, el `AuthProvider` detecta el cambio y el Layout raíz redirige automáticamente a `(tabs)`.

## Componentes Clave
- Utiliza componentes UI estandarizados (`Input`, `FormButton`).
- Estilos responsivos con Tailwind (modo oscuro soportado).
