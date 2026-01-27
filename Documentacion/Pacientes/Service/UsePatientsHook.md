# usePatients Hook

**Ubicación**: `src/features/patients/hooks/usePatients.ts`

## Descripción
React Hook personalizado para gestionar la suscripción a la lista de pacientes. Abstrae la lógica de conexión a Firestore y manejo de estados de carga/error.

## Firma
```typescript
const { patients, loading, error } = usePatients(therapistId: string);
```

## Funcionamiento
1. **Suscripción (`onSnapshot`)**:
   - Escucha cambios en tiempo real en la colección `patients`.
   - Cualquier cambio en la DB (nuevo paciente, edición, borrado) actualiza automáticamente el estado local `patients`.
2. **Consulta**:
   - Ordena los resultados alfabéticamente por `fullName`.
   - *(Pendiente)*: Filtrado por `therapistId` (actualmente comentado en código fuente).
3. **Mapeo**:
   - Transforma los documentos de Firestore (`doc.data()`) añadiendo el `id` del documento al objeto resultante para cumplir con la interfaz `Patient`.
