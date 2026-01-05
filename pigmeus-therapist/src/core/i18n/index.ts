import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import 'intl-pluralrules'; // Importante para Android

// Importamos los archivos JSON
import en from './locales/en.json';
import es from './locales/es.json';

// Configuración de los recursos
const resources = {
  en: { translation: en },
  es: { translation: es },
};

// Detectamos el idioma del dispositivo
const getDeviceLanguage = () => {
  const locales = Localization.getLocales();
  if (locales && locales.length > 0) {
    // Retorna 'es', 'en', etc.
    return locales[0].languageCode ?? 'es'; 
  }
  return 'es';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getDeviceLanguage(),
    fallbackLng: 'es',
    compatibilityJSON: 'v4', 
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false 
    }
  });

export default i18n;