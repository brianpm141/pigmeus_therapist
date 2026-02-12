# DateStrip Component

**Ubicación**: `src/components/layout/DateStrip.tsx`

## Descripción
Componente de navegación horizontal por fechas que muestra un rango de 60 días (7 días atrás del día actual hasta 53 días adelante). Permite al usuario seleccionar una fecha para visualizar la agenda correspondiente.

## Props
```typescript
interface DateStripProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onCalendarPress?: () => void;
}
```

### Parámetros
- **selectedDate**: Fecha actualmente seleccionada
- **onSelectDate**: Callback ejecutado cuando el usuario selecciona una fecha
- **onCalendarPress**: (Opcional) Callback para abrir el selector de calendario nativo

## Funcionamiento

### Generación de Fechas
- Genera un array de 60 fechas empezando desde 7 días antes del día actual
- Usa `date-fns` para manipulación de fechas
- El array se genera una sola vez (useMemo sin dependencias)

### Auto-scroll
- Al cambiar `selectedDate`, el componente automáticamente hace scroll para centrar la fecha seleccionada
- Utiliza `scrollToIndex` con `viewPosition: 0.5` para centrado
- Optimizado con `getItemLayout` para mejor performance

### Renderizado
- Cada fecha se renderiza con:
  - Nombre del día (ej: "LUN", "MAR") en mayúsculas
  - Número del día (ej: "15")
  - Estilo diferenciado si está seleccionada (bg-primary + sombra)
- Botón de calendario al final de la tira (icono "event")

### Optimización
- `DateStripItem` envuelto en `React.memo` con comparación personalizada
- Solo se re-renderiza si la fecha o el estado de selección cambian

## Uso
```typescript
<DateStrip 
  selectedDate={selectedDate} 
  onSelectDate={setSelectedDate} 
  onCalendarPress={() => setShowDatePicker(true)}
/>
```

## Notas de Implementación
- Usa `FlatList` horizontal para mejor performance con listas largas
- Los estilos se adaptan automáticamente a modo claro/oscuro via Tailwind
- El formato de fecha utiliza locale español (`es` de date-fns)
