# PatientCard

**Ubicación**: `src/features/patients/components/PatientCard.tsx`

## Descripción
Tarjeta de resumen diseñada para listados de pacientes. Muestra información clave de un vistazo para que el terapeuta pueda identificar rápidamente el estado del paciente.

## Características Principales
- **Visualización de Nombre**: Muestra el nombre completo del paciente.
- **Estado de Cita**:
  - Indica si tiene una "Próxima cita" programada con la fecha/hora.
  - Si no tiene cita, muestra "Sin cita asignada" con un estilo visual distintivo (color naranja).
- **Cálculo de Edad Dinámico**:
  - Calcula la diferencia entre la fecha de nacimiento y la fecha actual.
  - Prioriza la unidad más relevante:
    - **Años**: Si tiene >= 1 año.
    - **Meses**: Si tiene < 1 año pero >= 1 mes.
    - **Días**: Si tiene < 1 mes.
- **Métricas Físicas**: Muestra Peso (kg) y Estatura (m).

## Props
- `patient`: Objeto `Patient` con los datos a mostrar.
- `onPress`: Función callback para navegar al detalle del paciente.
