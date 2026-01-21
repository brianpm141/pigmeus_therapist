# Internacionalización (i18n)

La gestión de idiomas se encuentra centralizada en `src/core/i18n`. El proyecto utiliza `react-i18next` para la traducción de textos en tiempo de ejecución.

## Configuración
- **Ubicación:** `src/core/i18n/index.ts` (archivo principal de configuración).
- **Librería:** `i18next` con el wrapper `react-i18next`.

## Interacción
Los componentes y pantallas utilizan el hook `useTranslation` para acceder a las cadenas de texto traducidas. Esto permite cambiar el idioma de la interfaz sin necesidad de recargar la aplicación (dependiendo de la configuración de detección de idioma).

### Ejemplo de Uso
```tsx
import { useTranslation } from 'react-i18next';

const Component = () => {
  const { t } = useTranslation();
  
  return <Text>{t('clave.traduccion')}</Text>;
}
```

## Idiomas Soportados
(Se asume soporte para al menos Español e Inglés, verificar archivos JSON en `src/core/i18n/locales` si existen).
