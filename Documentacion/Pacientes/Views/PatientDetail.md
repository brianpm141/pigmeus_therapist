# PatientDetail

**Ubicación**: `src/features/patients/components/PatientDetail.tsx`

## Descripción
Componente modal que presenta la información completa del expediente del paciente en modo lectura. Utiliza el contenedor `FloatingFormContainer`.

## Estructura Visual
1. **Encabezado**: Muestra el nombre completo del paciente en grande.
2. **Barra de Métricas**:
   - **Edad**: Calculada dinámicamente.
   - **Peso**: En kg.
   - **Altura**: En metros.
3. **Información Personal**: Fecha de nacimiento, género, teléfono, dirección.
   - *Funcionalidad*: Al tocar el teléfono, intenta abrir la app de llamadas.
4. **Información Médica**:
   - **Diagnóstico**: Bloque informativo destacado.
   - **Plan de Tratamiento**: Bloque informativo destacado.
5. **Contacto de Emergencia**: Nombre y teléfono de contacto alternativo.

## Interacciones
- **Boton Editar**: Abre el formulario en modo edición (`onEdit`).
- **Boton Eliminar**: Inicia el flujo de eliminación del paciente (`onDelete`).
