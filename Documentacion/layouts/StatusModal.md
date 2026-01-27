
Componente modal diseñado para comunicar estados importantes, confirmar acciones o alertar sobre errores. Sigue una estética centrada con iconografía y colores semánticos.

## Características
- **Variantes Semánticas**: Soporta tipos `info`, `error`, `warning` y `delete` con colores e iconos predefinidos.
- **Doble Acción**: Permite configurar acciones de confirmación (principal) y cancelación (secundaria, opcional).
- **Diseño Centrado**: Modal emergente centrado con fondo atenuado y tarjeta redondeada.
- **Labels Personalizables**: Textos de botones configurables o con valores por defecto traducidos.

## Props

| Propiedad      | Tipo                                         | Requerido | Valor por defecto           | Descripción                                                                                          |
| -------------- | -------------------------------------------- | --------- | --------------------------- | ---------------------------------------------------------------------------------------------------- |
| `isVisible`    | `boolean`                                    | Sí        | -                           | Controla la visibilidad del modal.                                                                   |
| `type`         | `'info' \| 'error' \| 'warning' \| 'delete'` | Sí        | -                           | Define el estilo visual (color e icono) del modal.                                                   |
| `title`        | `string`                                     | Sí        | -                           | Título principal del modal.                                                                          |
| `message`      | `string`                                     | Sí        | -                           | Mensaje descriptivo o cuerpo del modal.                                                              |
| `onConfirm`    | `() => void`                                 | Sí        | -                           | Acción a ejecutar al presionar el botón principal.                                                   |
| `onCancel`     | `() => void`                                 | No        | -                           | Acción a ejecutar al presionar el botón secundario. Si se omite, no se muestra el botón de cancelar. |
| `confirmLabel` | `string`                                     | No        | `'actions.continue'` (i18n) | Texto del botón de confirmación.                                                                     |
| `cancelLabel`  | `string`                                     | No        | `'actions.cancel'` (i18n)   | Texto del botón de cancelación.                                                                      |

## Ejemplo de uso

```tsx
import { StatusModal } from '@/components/layout/StatusModal';
import { useState } from 'react';

// Ejemplo de Confirmación de Eliminación
const [showDeleteModal, setShowDeleteModal] = useState(false);

<StatusModal
    isVisible={showDeleteModal}
    type="delete"
    title="¿Eliminar Paciente?"
    message="Esta acción no se puede deshacer. Todos los datos del paciente serán borrados permanentemente."
    onConfirm={() => {
        deletePatient();
        setShowDeleteModal(false);
    }}
    onCancel={() => setShowDeleteModal(false)}
    confirmLabel="Sí, Eliminar"
/>

// Ejemplo de Error
<StatusModal
    isVisible={isError}
    type="error"
    title="Error de Conexión"
    message="No se pudo guardar la información. Verifique su conexión a internet."
    onConfirm={() => setIsError(false)}
    confirmLabel="Entendido"
/>
```
