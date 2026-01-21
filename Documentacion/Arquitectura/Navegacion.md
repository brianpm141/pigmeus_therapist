# Navegación

La navegación de la aplicación está construida sobre **Expo Router**, proporcionando una navegación nativa basada en la estructura del sistema de archivos.

## Estructura Principal `(tabs)`
La navegación principal se organiza mediante un esquema de pestañas (Tabs), definido en `app/(tabs)/_layout.tsx`.

### Rutas de Pestañas
1.  **Agenda (`index.tsx`)**: Pantalla principal por defecto. Muestra el calendario y citas del día.
    - Icono: `calendar-today` (MaterialIcons).
2.  **Pacientes (`patients.tsx`)**: Gestión de listado de pacientes.
    - Icono: `people` (MaterialIcons).
3.  **Consultas (`consultations.tsx`)**: Historial o gestión de consultas.
    - Icono: `assignment` (MaterialIcons).

## Configuración de Layout
- **Header:** Oculto globalmente (`headerShown: false`) para personalizar la cabecera en cada pantalla si es necesario.
- **Barra de Pestañas:** 
    - Color Activo: `#13c8ec` (Primary).
    - Color Inactivo: `#94a3b8` (Secondary).
    - Fondo: `#ffffff` (Surface).
    - Estilo: Elevación 10, sin borde superior.

## Flujo de Navegación
Al iniciar la aplicación, `app/_layout.tsx` carga las fuentes y, una vez listas, monta el grupo `(tabs)`, mostrando la ruta `index` (Agenda) como pantalla inicial.
