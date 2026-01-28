# AuthService

**Ubicación**: `src/services/authService.ts`

## Descripción
Servicio encargado de interactuar con Firebase Auth y Firestore para gestionar la autenticación y los datos del perfil del terapeuta. Encapsula las funciones nativas de Firebase.

## Métodos

### `register(credentials: RegisterCredentials)`
- **Propósito**: Crear una nueva cuenta de usuario y su perfil asociado.
- **Parámetros**:
  - `email`, `password`: Credenciales para Authentication.
  - `firstName`, `lastName`, `birthDate`: Datos para el perfil en Firestore.
- **Flujo**:
  1. `createUserWithEmailAndPassword` en Firebase Auth.
  2. `setDoc` en la colección `therapists` usando el `uid` del usuario.
  3. Inicializa contadores de estadísticas en 0.
- **Retorno**: Objeto `User` de Firebase.

### `login(credentials: LoginCredentials)`
- **Propósito**: Iniciar sesión.
- **Parámetros**: `email`, `password`.
- **Flujo**:
  1. `signInWithEmailAndPassword` en Firebase Auth.
- **Retorno**: Objeto `User` de Firebase.

### `logout()`
- **Propósito**: Cerrar sesión actual.
- **Flujo**: Ejecuta `signOut(auth)`.

### `updateTherapistProfile(uid, data)`
- **Propósito**: Actualizar datos del perfil (nombre, foto, etc.).
- **Parámetros**:
  - `uid`: ID del usuario.
  - `data`: Objeto con campos a actualizar (`firstName`, `photoURL`, etc.).
- **Flujo**: Actualiza el documento en `therapists/{uid}` añadiendo `updatedAt`.
