# EditProfileForm

**Ubicación**: `src/features/auth/components/EdithProfileForm.tsx`

## Descripción
Formulario completo para la edición de datos del terapeuta. Se utiliza dentro de un contenedor modal en la pantalla de Ajustes.

## Características
- **Gestión de Avatar**:
  - Permite seleccionar imagen de la galería usando `expo-image-picker`.
  - Sube la imagen a Firebase Storage (`profiles/{uid}`).
  - Actualiza la URL en el perfil de Firestore.
- **Datos Personales**: Edición de Nombre, Apellido y Fecha de nacimiento (con `DatePicker`).
- **Validación**: Campos obligatorios y formatos.
- **Internacionalización**: Todos los textos usan claves `auth.*`.

## Props
| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `onResult` | `(success: boolean) => void` | Callback invocado tras intentar guardar. `true` si fue exitoso, `false` si hubo error. |

## Integración
Este componente está desacoplado de la vista principal. Maneja su propio estado de carga y llamadas al servicio, comunicando solo el resultado final al padre mediante `onResult`.
