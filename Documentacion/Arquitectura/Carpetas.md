# Estructura de Carpetas

Descripción de la organización del código fuente en `pigmeus-therapist`:

- **`.expo/`**: Configuración y caché interna de Expo.
- **`.vscode/`**: Configuraciones del entorno de desarrollo (VS Code).
- **`app/`**: Contiene la estructura de navegación de Expo Router.
    - **`(tabs)/`**: Grupo de rutas para la navegación principal por pestañas (Agenda, Pacientes, Consultas).
    - **`_layout.tsx`**: Layout raíz y configuración global de providers y estilos.
    - **`global.css`**: Estilos globales.
- **`assets/`**: Imágenes, fuentes y otros recursos estáticos.
- **`src/`**: Código fuente principal de la aplicación.
    - **`components/`**: Componentes visuales.
        - **`ui/`**: Componentes atómicos reutilizables (Input, Botones, etc.).
    - **`core/`**: Configuración central (i18n, constantes).
    - **`features/`**: Módulos funcionales de la aplicación (Lógica de negocio agrupada).
    - **`services/`**: Comunicación con APIs externas o bases de datos.
    - **`types/`**: Definiciones de tipos TypeScript globales.
- **`Documentacion/`**: Archivos de documentación del proyecto (Arquitectura, UI).
