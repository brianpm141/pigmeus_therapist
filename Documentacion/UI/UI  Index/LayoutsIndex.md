# Catálogo de Componentes



Este archivo sirve como la fuente de verdad y documentación para los componentes reutilizables de **Pigmeus Therapist**.

## Importación
Todos los componentes de UI se centralizan y deben importarse desde `UIComponents.ts`.

### Ejemplo de uso (Mínimo)
```tsx
import { Input } from "@/components/ui/UIComponents";

<Input label="Nombre" />
```

## Índice de Componentes

### UI
- Input
- FloatingButton
- SegmentedControl
- DatePicker
- TextArea
- FormButton
- OptionSelector


---

# DatePicker



Selector de fecha adaptativo que utiliza los componentes nativos de cada plataforma para garantizar una experiencia de usuario familiar y optimizada.

## Características
- **Interfaz Nativa**: Despliega el calendario nativo en Android y un selector modal tipo "spinner" en iOS.
- **Trigger Personalizable**: Muestra la fecha seleccionada en un campo con estilo unificado a los inputs de texto.
- **Formato Automático**: Formatea la visualización de la fecha al formato local (dd/MM/yyyy).
- **Manejo de Tema**: Estilos compatibles automáticos tanto para modo claro como oscuro.
- **Validación**: Soporte para estados de error y fechas mínimas/máximas.

## Props

| Propiedad     | Tipo                   | Requerido | Valor por defecto     | Descripción                                       |
| ------------- | ---------------------- | --------- | --------------------- | ------------------------------------------------- |
| `label`       | `string`               | No        | -                     | Texto descriptivo encima del campo.               |
| `value`       | `Date`                 | No        | -                     | Objeto fecha seleccionado actualmente.            |
| `onChange`    | `(date: Date) => void` | Sí        | -                     | Función callback llamada al confirmar una fecha.  |
| `placeholder` | `string`               | No        | `'Seleccionar fecha'` | Texto a mostrar cuando no hay fecha seleccionada. |
| `error`       | `string`               | No        | -                     | Mensaje de error (marca el borde en rojo).        |
| `minimumDate` | `Date`                 | No        | -                     | Fecha mínima seleccionable.                       |
| `maximumDate` | `Date`                 | No        | -                     | Fecha máxima seleccionable.                       |
| `disabled`    | `boolean`              | No        | `false`               | Deshabilita la interacción con el campo.          |

## Ejemplo de uso

```tsx
import { DatePicker } from '@/components/ui/UIComponents';
import { useState } from 'react';

const MyForm = () => {
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);

  return (
    <DatePicker
      label="Fecha de Nacimiento"
      value={birthDate}
      onChange={setBirthDate}
      maximumDate={new Date()} // No permitir fechas futuras
      error={!birthDate ? "La fecha es obligatoria" : undefined}
    />
  );
};
```


---

# FloatingButton



Componente de interfaz de usuario que renderiza un botón de acción flotante (FAB) utilizado para acciones principales en la pantalla.

## Características
- Se posiciona automáticamente en la esquina inferior derecha.
- Diseño circular con sombra para elevación visual.
- Soporta iconos personalizados de la librería Ionicons.
- Proporciona retroalimentación visual al ser presionado.

## Props

| Propiedad  | Tipo                             | Requerido | Valor por defecto | Descripción                                                 |
| ---------- | -------------------------------- | --------- | ----------------- | ----------------------------------------------------------- |
| `onPress`  | `() => void`                     | Sí        | -                 | Función que se ejecuta cuando el usuario presiona el botón. |
| `iconName` | `keyof typeof Ionicons.glyphMap` | No        | `'add'`           | Nombre del icono de la librería Ionicons a mostrar.         |

## Ejemplo de uso

```tsx
import { FloatingButton } from '@/components/ui/FloatingButton';

// Uso básico (icono por defecto 'add')
<FloatingButton onPress={() => handleCreate()} />

// Uso con icono personalizado para búsqueda
<FloatingButton 
    onPress={() => handleSearch()} 
    iconName="search" 
/>
```


---

# Input


Campo de texto estandarizado que incluye etiqueta opcional, manejo de errores y estilos adaptables al tema (claro/oscuro).

## Características
- Muestra una etiqueta (label) descriptiva sobre el campo.
- Visualización de mensajes de error con estilos de validación (borde rojo y texto de ayuda).
- Soporte completo para todas las propiedades nativas de `TextInput` (keyboardType, secureTextEntry, etc.).
- Estilos responsivos que se adaptan al modo oscuro y claro automáticamente.

## Props

Este componente hereda todas las propiedades de `TextInputProps` de React Native.

| Propiedad   | Tipo             | Requerido | Valor por defecto | Descripción                                                                                          |
| ----------- | ---------------- | --------- | ----------------- | ---------------------------------------------------------------------------------------------------- |
| `label`     | `string`         | No        | -                 | Texto descriptivo que aparece encima del campo de entrada.                                           |
| `error`     | `string`         | No        | -                 | Mensaje de error. Si existe, cambia el color del borde a rojo y muestra el mensaje debajo del input. |
| `className` | `string`         | No        | -                 | Clases adicionales de Tailwind para personalizar el contenedor.                                      |
| `...props`  | `TextInputProps` | No        | -                 | Cualquier otra propiedad estándar del componente TextInput de React Native.                          |

## Ejemplo de uso

```tsx
import { Input } from "@/components/ui/Input";

// Uso básico con etiqueta
<Input
  label="Nombre del Paciente"
  placeholder="Ej: Juan Pérez"
  value={name}
  onChangeText={setName}
/>

// Uso con validación de error y contraseña
<Input
  label="Contraseña"
  placeholder="******"
  value={password}
  onChangeText={setPassword}
  secureTextEntry={true}
  error={errorMessage} // Si contiene texto, se muestra el estado de error
/>
```


---

# FormButton

tit
Botón versátil utilizado para acciones principales, secundarias y de peligro en formularios y pantallas. Soporta múltiples variantes visuales y estados de carga.

## Características
- **Múltiples Variantes**: Soporta estilos `primary`, `outline`, `ghost` y `danger` para diferentes jerarquías visuales.
- **Estado de Carga**: Muestra un indicador de actividad (`ActivityIndicator`) y deshabilita la interacción automáticamente.
- **Iconos**: Permite la integración de iconos mediante nombres de MaterialIcons.
- **Feedback Táctil**: Reduce la opacidad al ser presionado.
- **Consistencia**: Utiliza la tipografía y colores del sistema de diseño.

## Props

| Propiedad   | Tipo                                            | Requerido | Valor por defecto | Descripción                                                           |
| ----------- | ----------------------------------------------- | --------- | ----------------- | --------------------------------------------------------------------- |
| `title`     | `string`                                        | Sí        | -                 | Texto a mostrar dentro del botón.                                     |
| `onPress`   | `() => void`                                    | Sí        | -                 | Función a ejecutar al presionar el botón.                             |
| `variant`   | `'primary' \| 'outline' \| 'ghost' \| 'danger'` | No        | `'primary'`       | Estilo visual del botón.                                              |
| `iconName`  | `MaterialIcons Name`                            | No        | -                 | Nombre del icono de MaterialIcons a mostrar a la izquierda del texto. |
| `isLoading` | `boolean`                                       | No        | `false`           | Si es true, muestra un spinner y deshabilita el botón.                |
| `disabled`  | `boolean`                                       | No        | `false`           | Deshabilita la interacción y reduce la opacidad.                      |
| `className` | `string`                                        | No        | -                 | Clases adicionales de Tailwind para estilos personalizados.           |

## Ejemplo de uso

```tsx
import { FormButton } from '@/components/ui/UIComponents';
import { MaterialIcons } from '@expo/vector-icons';

// Botón Primario
<FormButton 
    title="Guardar Cambios" 
    onPress={handleSubmit} 
/>

// Botón con Icono y Estado de Carga
<FormButton 
    title="Enviar" 
    variant="primary"
    iconName="send"
    isLoading={isSubmitting}
    onPress={handleSend}
/>

// Botón de Peligro (Eliminar)
<FormButton 
    title="Eliminar Cuenta" 
    variant="danger" 
    onPress={handleDelete} 
/>
```


---

# OptionSelector



Componente de selección desplegable avanzado que soporta búsqueda, iconos/iniciales, subtítulos y creación de nuevas opciones. Diseñado para ofrecer una mejor experiencia que un `Picker` nativo estándar.

## Características

- **Búsqueda Integrada**: Permite filtrar opciones escribiendo texto (toggle con icono de lupa).
- **Visualización Rica**: Muestra iniciales en un círculo coloreado y soporta subtítulos para cada opción.
- **Creación de Ítems**: Opción opcional para "Crear Nuevo" elemento si no se encuentra.
- **Validación**: Soporta estado de error con mensaje y borde rojo.
- **Teclado**: Manejo adecuado del teclado y scroll en la lista.

## Props

| Propiedad | Tipo | Requerido | Valor por defecto | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `label` | `string` | Sí | - | Etiqueta del campo mostrada encima del selector. |
| `options` | `Option[]` | Sí | - | Array de opciones disponibles. Ver interfaz `Option` abajo. |
| `selectedValue` | `string` | No | - | Valor (`value`) de la opción actualmente seleccionada. |
| `onSelect` | `(option: Option) => void` | Sí | - | Callback ejecutado al seleccionar una opción. |
| `onAddNew` | `() => void` | No | - | Callback para el botón de "Crear Nuevo". Si no se provee, no se muestra el botón. |
| `placeholder` | `string` | No | `"Seleccionar..."` | Texto a mostrar cuando no hay selección. |
| `error` | `string` | No | - | Mensaje de error a mostrar y activa el estado de error visual. |

### Interfaz Option

```typescript
interface Option {
  label: string;  
  value: string;  
  subtitle?: string; 
}
```

## Ejemplo de uso

```tsx
import { OptionSelector, Option } from '@/components/ui/OptionSelector';
import { useState } from 'react';

// ... dentro del componente

const [selectedPatient, setSelectedPatient] = useState<string>();

const patients: Option[] = [
  { label: 'Juan Pérez', value: '1', subtitle: 'ID: 12345' },
  { label: 'María García', value: '2', subtitle: 'ID: 67890' },
];

<OptionSelector
  label="Paciente"
  placeholder="Buscar paciente..."
  options={patients}
  selectedValue={selectedPatient}
  onSelect={(opt) => setSelectedPatient(opt.value)}
  onAddNew={() => router.push('/patients/new')}
  error={!selectedPatient ? 'Debe seleccionar un paciente' : undefined}
/>
```


---

# SegmentedControl



Control de selección segmentado que permite al usuario elegir una opción única entre un conjunto predefinido, similar a un grupo de radio buttons pero con apariencia de pestañas compactas.

## Características
- Visualización de opciones en un contenedor horizontal.
- Indicador visual claro (fondo blanco y sombra) para la opción seleccionada.
- Soporte para etiquetas (label) descriptivas.
- Animación suave y elevación en la selección activa.

## Props

| Propiedad  | Tipo                      | Requerido | Valor por defecto | Descripción                                                                            |
| ---------- | ------------------------- | --------- | ----------------- | -------------------------------------------------------------------------------------- |
| `label`    | `string`                  | No        | -                 | Texto descriptivo o título que aparece encima del control.                             |
| `options`  | `Option[]`                | Sí        | -                 | Arreglo de opciones a mostrar. Cada opción debe tener `label` y `value`.               |
| `value`    | `string`                  | Sí        | -                 | El valor de la opción actualmente seleccionada.                                        |
| `onChange` | `(value: string) => void` | Sí        | -                 | Callback que se ejecuta al seleccionar una nueva opción. Recibe el valor seleccionado. |

### Interfaz Option
```typescript
interface Option {
  label: string; // Texto a mostrar
  value: string; // Valor interno único
}
```

## Ejemplo de uso

```tsx
import { SegmentedControl } from "@/components/ui/UIComponents";
import { useState } from "react";

const MyScreen = () => {
    const [gender, setGender] = useState('female');

    const genderOptions = [
        { label: 'Femenino', value: 'female' },
        { label: 'Masculino', value: 'male' },
    ];

    return (
        <SegmentedControl
            label="Género"
            options={genderOptions}
            value={gender}
            onChange={setGender}
        />
    );
};
```


---

# TextArea

# TextArea

Campo de texto multilínea diseñado para entradas de texto extenso, como descripciones, notas o comentarios, manteniendo la consistencia visual con el resto de los componentes.

## Características
- **Altura Mínima**: Altura base garantizada para facilitar la escritura de párrafos.
- **Alineación Superior**: El texto comienza desde la esquina superior izquierda (crucial en Android).
- ** Estilos Unificados** : Comparte el lenguaje de diseño (bordes redondeados, colores, fuentes) con los componentes `Input`.
- **Validación Integrada**: Soporte visual para mensajes de error.
- **Adaptable**: Soporta todas las propiedades nativas de `TextInput` y estilos personalizados.

## Props

Este componente extiende `TextInputProps` de React Native, por lo que acepta todas sus propiedades.

| Propiedad   | Tipo             | Requerido | Valor por defecto | Descripción                                                                           |
| ----------- | ---------------- | --------- | ----------------- | ------------------------------------------------------------------------------------- |
| `label`     | `string`         | No        | -                 | Título o etiqueta descriptiva sobre el área de texto.                                 |
| `error`     | `string`         | No        | -                 | Mensaje de error a mostrar debajo del componente. Cambia el borde a color de peligro. |
| `className` | `string`         | No        | -                 | Clases de estilo adicionales (Tailwind) para el contenedor del input.                 |
| `...props`  | `TextInputProps` | No        | -                 | Propiedades estándar como `placeholder`, `onChangeText`, `value`, etc.                |

## Ejemplo de uso

```tsx
import { TextArea } from '@/components/ui/UIComponents';
import { useState } from 'react';

const NotesScreen = () => {
    const [notes, setNotes] = useState('');

    return (
        <TextArea
            label="Notas de la Consulta"
            placeholder="Escribe aquí los detalles..."
            value={notes}
            onChangeText={setNotes}
            numberOfLines={4}
        />
    );
};
```


---

# SettingItem

# SettingItem

Componente de lista para opciones de configuración de la aplicación. Puede funcionar como un botón navegable o como un control interruptor (Switch).

## Características
- Muestra un icono a la izquierda con fondo coloreado.
- Título principal con estilo adaptable (claro/oscuro).
- Elemento derecho personalizable (por defecto un chevron, pero puede ser un Switch o cualquier otro elemento).
- Muestra el valor seleccionado si se proporciona.
- Interactividad configurable mediante `onPress`.

## Props

| Propiedad      | Tipo                                        | Requerido | Valor por defecto     | Descripción                                                                              |
| -------------- | ------------------------------------------- | --------- | --------------------- | ---------------------------------------------------------------------------------------- |
| `iconName`     | `string` (MaterialIcons)                    | Sí        | -                     | Nombre del icono de MaterialIcons a mostrar a la izquierda.                              |
| `title`        | `string`                                    | Sí        | -                     | Texto principal de la opción.                                                            |
| `value`        | `string`                                    | No        | -                     | Valor actual de la configuración (se muestra en texto gris a la derecha).                |
| `onPress`      | `() => void`                                | No        | -                     | Función a ejecutar al presionar el ítem.                                                 |
| `rightElement` | `React.ReactNode`                           | No        | `<MaterialIcons ...>` | Elemento personalizado a mostrar a la derecha. Si no se define, muestra Chevron Right.  |

## Ejemplo de uso

### Básico (Navegación)
```tsx
import { SettingItem } from "@/components/ui/SettingItem";

<SettingItem 
  iconName="language" 
  title="Idioma" 
  value="Español"
  onPress={() => console.log('Cambiar idioma')}
/>
```

### Con Switch (Modo Oscuro)
```tsx
import { Switch } from "react-native";
import { SettingItem } from "@/components/ui/SettingItem";

<SettingItem 
  iconName="brightness-4" 
  title="Modo Oscuro" 
  rightElement={
    <Switch
      value={isDark}
      onValueChange={toggleTheme}
    />
  }
/>
```
