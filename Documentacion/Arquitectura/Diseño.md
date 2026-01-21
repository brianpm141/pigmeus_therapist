# Diseño de Arquitectura

Pigmeus Therapist está construida utilizando **React Native** con **Expo**, siguiendo una arquitectura modular basada en características (fetures).

## Principios Generales
- **Modularidad:** El código está organizado por dominio funcional en la carpeta `src/features`, permitiendo que cada módulo encapsule su propia lógica, pantallas y componentes específicos.
- **Componentes UI:** Existe una biblioteca de componentes base reutilizables en `src/components/ui` que asegura la consistencia visual y reduce la duplicación de código.
- **Navegación Basada en Archivos:** Se utiliza **Expo Router**, donde la estructura de archivos en la carpeta `app` define directamente las rutas de navegación de la aplicación.
- **Gestión de Estado:** (Pendiente de definición explícita en código, pero preparada para hooks y contextos locales por feature).

## Tecnologías Clave
- **Frontend:** React Native, Expo.
- **Estilos:** NativeWind (Tailwind CSS para React Native).
- **Tipado:** TypeScript estricto.
- **Iconos:** Expo Vector Icons / Ionicons.
