
Componente contenedor para secciones de formulario. Agrupa inputs bajo un título traducible y estandarizado.

## Características
- **Título Integrado**: Renderiza un título de sección con estilos consistentes.
- **Icono Opcional**: Permite mostrar un icono de MaterialIcons junto al título.
- **Internacionalización**: Acepta una `key` de i18n para el título.
- **Espaciado Vertical**: Aplica márgenes inferiores para separar secciones.
- **Agrupamiento**: Coloca los elementos hijos en una pila vertical con espaciado uniforme.

## Props

| Propiedad | Tipo | Requerido | Valor por defecto | Descripción |
| --------- | ---- | --------- | ----------------- | ----------- |
| `titleKey` | `string` | Sí | - | Clave de traducción (i18n) para el título de la sección. |
| `children` | `React.ReactNode` | Sí | - | Elementos del formulario a agrupar en esta sección. |
| `iconName` | `MaterialIcons Name` | No | - | Nombre del icono de la librería MaterialIcons a mostrar junto al título. |

## Ejemplo de uso

```tsx
import { FormSection } from '@/components/layout/Molecules';
import { Input } from '@/components/ui/UIComponents';

<FormSection titleKey="patient.personalInfo" iconName="person">
    <Input label="Nombre" />
    <Input label="Apellidos" />
</FormSection>
```
