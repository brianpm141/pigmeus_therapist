# PatientForm

**Ubicación**: `src/features/patients/components/PatientForm.tsx`

## Descripción
Formulario completo para la creación (registro) y edición de pacientes.

## Gestión de Estado
Utiliza estados locales (`useState`) para cada campo del formulario para tener control total sobre la validación y transformación de datos.
- **Datos Personales**: Nombre, Apellido, Fecha Nacimiento, Género.
- **Datos Físicos**: Peso, Altura.
- **Datos Médicos**: Diagnóstico, Plan de Tratamiento.
- **Datos de Contacto**: Teléfono, Dirección, Contacto de Emergencia.

## Lógica Destacada
- **Inicialización**:
  - Si recibe `initialData` (modo edición), pre-carga los estados con la información del paciente.
  - Convierte los `Timestamp` de Firebase a objetos `Date` nativos para el DatePicker.
- **Cálculo de Edad Interactiva**:
  - Al seleccionar una fecha de nacimiento, calcula y muestra inmediatamente la edad que tendrá el paciente (Años/Meses/Días).
- **Validación**:
  - Comprueba que `Nombre` y `Apellido` no estén vacíos.
  - Muestra mensajes de error en línea.
- **Persistencia**:
  - Determina si llamar a `savePatient` (nuevo) o `updatePatient` (existente).
  - Maneja la carga (`loading`) y errores mediante un modal de estado.
