
Este archivo sirve como la fuente de verdad y documentación para los componentes de layout (estructurales) de **Pigmeus Therapist**.

## Importación
Todos los componentes de layout se centralizan y deben importarse desde `Molecules.tsx`.

### Ejemplo de uso
```tsx
import { FloatingFormContainer, FormSection } from "@/components/layout/Molecules";
```

## Índice de Layouts

### Contenedores y Estructura
- FloatingFormContainer
- FormSection
- FormPairRows
- StatusModal


---

# FloatingFormContainer


Componente de layout diseñado para presentar formularios o contenido en una ventana modal flotante. Proporciona una estructura consistente con manejo de teclado, scroll y un encabezado estandarizado.

## Características
- **Modal Nativo**: Utiliza `Modal` con animación `fade` y fondo oscurecido (`bg-black/70`).
- **Manejo de Teclado**: Incorpora `KeyboardAvoidingView` y `TouchableWithoutFeedback` para una experiencia fluida al interactuar con inputs.
- **Diseño Adaptable**: Tarjeta central con esquinas redondeadas, sombra y altura máxima del 90% de la pantalla.
- **Encabezado Integrado**: Incluye un área de título, icono opcional y un botón de cierre preconfigurado.
- **Scroll Automático**: El contenido se renderiza dentro de un `ScrollView` para soportar formularios extensos.

## Props

| Propiedad | Tipo | Requerido | Valor por defecto | Descripción |
| --------- | ---- | --------- | ----------------- | ----------- |
| `visible` | `boolean` | Sí | - | Determina si el modal está visible o no. |
| `onClose` | `() => void` | Sí | - | Callback ejecutado al cerrar el modal (botón X o botón atrás en Android). |
| `title` | `string` | Sí | - | Texto que se muestra en el encabezado del modal. |
| `children` | `React.ReactNode` | Sí | - | Elementos hijos a renderizar dentro del contenedor (campos del formulario, botones, etc.). |
| `iconName` | `MaterialIcons Name` | No | - | Nombre del icono de la librería MaterialIcons a mostrar junto al título. |

## Ejemplo de uso

```tsx
import React, { useState } from 'react';
import { Text, View, TextInput } from 'react-native';
import { FloatingFormContainer } from '@/components/layout/FloatingFormContainer';
import { FormButton } from '@/components/ui/FormButton';

export const ExampleScreen = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <View>
            <FormButton 
                title="Abrir Formulario" 
                onPress={() => setIsFormOpen(true)} 
            />

            <FloatingFormContainer
                visible={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title="Editar Perfil"
                iconName="edit"
            >
                <View className="gap-4">
                    <Text>Nombre</Text>
                    <TextInput 
                        className="bg-gray-100 p-3 rounded-lg"
                        placeholder="Ingresa tu nombre"
                    />
                    
                    <FormButton 
                        title="Guardar" 
                        onPress={() => {
                            // Lógica de guardado
                            setIsFormOpen(false);
                        }} 
                    />
                </View>
            </FloatingFormContainer>
        </View>
    );
};
```


---

# FormPairRows


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


---

# FormSection


Componente contenedor para secciones de formulario. Agrupa inputs bajo un título traducible y estandarizado.

## Características
- **Título Integrado**: Renderiza un título de sección con estilos consistentes.
- **Icono Opcional**: Permite mostrar un icono de MaterialIcons junto al título.
- **Internacionalización**: Acepta una `key` de i18n para el título.
- **Espaciado Vertical**: Aplica márgenes inferiores para separar secciones.
- **Agrupamiento**: Coloca los elementos hijos en una pila vertical con espaciado uniforme.

## Props

| Propiedad  | Tipo                 | Requerido | Valor por defecto | Descripción                                                              |
| ---------- | -------------------- | --------- | ----------------- | ------------------------------------------------------------------------ |
| `titleKey` | `string`             | Sí        | -                 | Clave de traducción (i18n) para el título de la sección.                 |
| `children` | `React.ReactNode`    | Sí        | -                 | Elementos del formulario a agrupar en esta sección.                      |
| `iconName` | `MaterialIcons Name` | No        | -                 | Nombre del icono de la librería MaterialIcons a mostrar junto al título. |

## Ejemplo de uso

```tsx
import { FormSection } from '@/components/layout/Molecules';
import { Input } from '@/components/ui/UIComponents';

<FormSection titleKey="patient.personalInfo" iconName="person">
    <Input label="Nombre" />
    <Input label="Apellidos" />
</FormSection>
```


---

# StatusModal


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


---

# LayoutsIndex

# Catálogo de Layouts


Este archivo sirve como la fuente de verdad y documentación para los componentes de layout (estructurales) de **Pigmeus Therapist**.

## Importación
Todos los componentes de layout se centralizan y deben importarse desde `Molecules.tsx`.

### Ejemplo de uso
```tsx
import { FloatingFormContainer, FormSection } from "@/components/layout/Molecules";
```

## Índice de Layouts

### Contenedores y Estructura
- FloatingFormContainer
- FormSection
- FormPairRows
- StatusModal




# FormPairRows


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


---

# FormSection


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


---

# StatusModal


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


---

# MainHeader

# MainHeader

Encabezado principal de la aplicación que muestra la información del terapeuta logueado.

## Características
- Muestra la foto de perfil del terapeuta (o avatar por defecto si no existe).
- Nombre del terapeuta obtenido dinámicamente desde el hook `useTherapistProfile`.
- Borde de la foto coloreado según el tema actual (`colors.primary`).
- Botón de notificaciones con indicador de estado (punto rojo).

## Props
Este componente **no recibe props**. Se conecta automáticamente a los contextos globales:
- `useTherapistProfile`: Para obtener datos del usuario (nombre, foto).
- `useTheme`: Para obtener el color primario del tema para bordes e iconos.

## Ejemplo de uso

```tsx
import { MainHeader } from "@/components/layout/MainHeader";

// Usado comúnmente en el Layout principal de la app
export default function TabLayout() {
  return (
    <View className="flex-1">
        <MainHeader />
        {/* Contenido de la pantalla */}
        <Slot />
    </View>
  );
}
```

## Dependencias
- `@/features/auth/hooks/useTherapistProfile`: Hook para datos del usuario.
- `@/core/ThemeContext`: Hook para sistema de temas.
