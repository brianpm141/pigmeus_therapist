# PatientService

**Ubicación**: `src/services/patientService.ts`

## Descripción
Capa de servicio encargada de todas las operaciones CRUD (Create, Read, Update, Delete) directas contra la base de datos Firebase Firestore para la colección `patients`.

## Métodos

### `savePatient(patientData: any)`
- **Propósito**: Crear un nuevo paciente.
- **Flujo**:
  1. Recibe el objeto con datos del paciente.
  2. Añade el timestamp `createdAt: serverTimestamp()`.
  3. Ejecuta `addDoc` en la colección `patients`.
- **Retorno**: `{ success: true, id: string }`

### `updatePatient(id: string, data: Partial<Patient>)`
- **Propósito**: Actualizar un paciente existente.
- **Flujo**:
  1. Recibe el `id` del documento y los datos parciales a modificar.
  2. Añade el timestamp `updatedAt: serverTimestamp()`.
  3. Ejecuta `updateDoc` sobre la referencia del documento.
- **Retorno**: `{ success: true }`

### `deletePatient(id: string)`
- **Propósito**: Eliminar un paciente.
- **Flujo**:
  1. Obtiene la referencia del documento por `id`.
  2. Ejecuta `deleteDoc`.
- **Retorno**: `{ success: true }`
