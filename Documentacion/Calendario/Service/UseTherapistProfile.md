# useTherapistProfile Hook

**Ubicación**: `src/features/auth/hooks/useTherapistProfile.ts`

## Descripción
Hook React que proporciona acceso al perfil del terapeuta autenticado. Se utiliza en múltiples pantallas (Agenda, Citas, Pacientes, Configuración) para obtener el `uid` del usuario y otros datos del perfil desde el contexto de autenticación.

## Firma
```typescript
const { profile, loading } = useTherapistProfile();
```

## Retorno
```typescript
interface ReturnType {
  profile: {
    uid: string;
    email: string;
    fullName: string;
    // ... otros campos del perfil
  } | null;
  loading: boolean;
}
```

## Funcionamiento
1. Consume el `AuthContext` mediante `useAuth()`
2. Extrae el objeto `user` del contexto
3. Devuelve el perfil del usuario actual y el estado de carga

## Uso en Agenda
En la pantalla de agenda (`app/(tabs)/index.tsx`), se utiliza para:
- Obtener el `therapistId` (uid) para filtrar las citas
- Pasar el identificador a los servicios de Firestore

### Ejemplo
```typescript
const { profile } = useTherapistProfile();

const fetchAppointments = useCallback(async () => {
  if (!profile?.uid) return;
  const { appointments } = await AppointmentService.getAllAppointmentsForAgenda(profile.uid);
  setAppointments(appointments);
}, [profile?.uid]);
```

## Ventajas
- **Abstracción**: Encapsula el acceso al contexto de autenticación
- **Type Safety**: Garantiza que el perfil tenga la estructura correcta
- **Reutilización**: Se usa consistentemente en todas las features que requieren el usuario actual
