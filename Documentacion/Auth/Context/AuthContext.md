# AuthContext

**Ubicación**: `src/features/auth/AuthContext.tsx`

## Descripción
Provider de React Context que gestiona el estado global de autenticación. Mantiene sincronizada la sesión del usuario y sus datos de perfil en tiempo real.

## Estado (Values)

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `user` | `User \| null` | Objeto de usuario de Firebase Auth. Contiene `uid`, `email`, etc. |
| `userProfile` | `TherapistProfile \| null` | Datos extendidos almacenados en Firestore (nombre, estadísticas, foto). |
| `isLoading` | `boolean` | `true` mientras se verifica el estado inicial de auth o se carga el perfil. |
| `isAuthenticated` | `boolean` | `true` si existe un usuario logueado. |

## Funcionamiento Interno
1. **onAuthStateChanged**: Escucha cambios en la autenticación de Firebase.
2. **Snapshot de Perfil**: 
   - Cuando un usuario se loguea, se crea una suscripción (`onSnapshot`) al documento `therapists/{uid}`.
   - Esto permite que cualquier cambio en la BD (ej. actualizar foto) se refleje instantáneamente en la app sin recargar.
3. **Limpieza**: Al cerrar sesión, se cancelan las suscripciones para evitar fugas de memoria.

## Hook: `useAuth()`
Exponemos un hook personalizado para consumir este contexto fácilmente en cualquier componente.

```tsx
const { user, userProfile, isLoading } = useAuth();
```
