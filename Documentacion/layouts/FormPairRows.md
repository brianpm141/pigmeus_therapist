
Componente de layout que organiza exactamente dos elementos hijos en una fila con espaciado equitativo. Ideal para inputs emparejados (ej. Fecha Inicio - Fecha Fin, Peso - Altura).

## Características
- **Diseño en Fila**: Distribuye el espacio horizontalmente 50/50.
- **Espaciado Automático**: Maneja los márgenes entre los dos elementos para mantener consistencia.
- **Validación de Tipos**: Requiere estrictamente un arreglo de 2 elementos (`[ReactNode, ReactNode]`).

## Props

| Propiedad | Tipo | Requerido | Valor por defecto | Descripción |
| --------- | ---- | --------- | ----------------- | ----------- |
| `children` | `[React.ReactNode, React.ReactNode]` | Sí | - | Tupla de exactamente dos elementos a renderizar en la fila. |

## Ejemplo de uso

```tsx
import { FormPairRows } from '@/components/layout/Molecules';
import { Input } from '@/components/ui/UIComponents';

<FormPairRows>
    <Input label="Peso (kg)" placeholder="0.0" />
    <Input label="Altura (cm)" placeholder="0" />
</FormPairRows>
```
