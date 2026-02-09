# useConsultations Hook

**Ubicación**: `src/features/appointments/hooks/useConsultations.ts`

## Descripción
Hook principal para el tablero de citas. Se encarga de obtener las citas activas, combinar citas individuales con patrones recurrentes, y calcular las próximas ocurrencias para mostrar una lista unificada y ordenada cronológicamente.

## Firma
```typescript
const { 
  sections,     // Datos procesados para SectionList
  loading,      // Estado de carga inicial
  refreshing,   // Estado de recarga (pull-to-refresh)
  onRefresh,    // Función para recargar manualmente
  searchQuery,  // Estado del texto de búsqueda
  setSearchQuery, 
  handleCancel  // Función para cancelar citas/patrones
} = useConsultations();
```

## Lógica Clave

### 1. Unificación de Datos
Combina dos fuentes de datos distintas provenientes del servicio:
- **Single Appointments**: Citas sueltas tradicionales.
- **Recurrence Patterns**: Patrones maestros de repetición.

### 2. Proyección de Recurrencias (`getNextPatternOccurrence`)
Para cada patrón recurrente, el hook calcula dinámicamente cuál es la **siguiente fecha real** de ocurrencia basándose en:
- Día de la semana actual vs. días configurados en el patrón.
- Hora del día (si la cita de hoy ya pasó, busca la siguiente).
Esto permite ordenar la lista cronológicamente mezclando citas fijas con recurrentes.

### 3. Agrupación por Secciones (`sections`)
Transforma la lista plana en una estructura compatible con `SectionList` de React Native:
- Agrupa por fecha (`YYYY-MM-DD`).
- Genera títulos amigables ("Hoy", "Mañana", "Lunes 15 de Octubre").
- Filtra localmente por nombre de paciente si hay `searchQuery`.

## Retorno
```typescript
interface Section {
  title: string;
  data: ConsultationItem[];
}
```
