
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
