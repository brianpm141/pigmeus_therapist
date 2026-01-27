import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { View } from 'react-native';
import { vars } from "nativewind"; 
import AsyncStorage from '@react-native-async-storage/async-storage';

// Paleta "Pigmeus Soft": Colores amigables y accesibles
export const THEME_PALETTE = {
  ocean: {
    name: 'Océano',
    primary: '#38bdf8',
    dark: '#0ea5e9',
    soft: 'rgba(56, 189, 248, 0.15)',
    bg: 'rgba(56, 189, 248, 0.1)',
    bgDark: 'rgba(23, 51, 132, 0.75)'
  },

  mint: {
    name: 'Menta',
    primary: '#34d399',
    dark: '#10b981',
    soft: 'rgba(52, 211, 153, 0.15)',
    bg: 'rgba(52, 211, 153, 0.1)',
    bgDark: 'rgba(13, 74, 59, 0.75)'
  },

  lavender: {
    name: 'Lavanda',
    primary: '#a78bfa',
    dark: '#8b5cf6',
    soft: 'rgba(167, 139, 250, 0.15)',
    bg: 'rgba(167, 139, 250, 0.1)',
    bgDark: 'rgba(55, 48, 163, 0.75)'
  },

  rose: {
    name: 'Rosa',
    primary: '#f472b6',
    dark: '#ec4899',
    soft: 'rgba(244, 114, 182, 0.15)',
    bg: 'rgba(244, 114, 182, 0.1)',
    bgDark: 'rgba(112, 26, 62, 0.7)'
  },

  coral: {
    name: 'Coral',
    primary: '#fb923c',
    dark: '#f97316',
    soft: 'rgba(251, 146, 60, 0.15)',
    bg: 'rgba(251, 146, 60, 0.1)',
    bgDark:'rgba(124, 45, 18, 0.75)'

  },

  slate: {
    name: 'Pizarra',
    primary: '#94a3b8',
    dark: '#64748b',
    soft: 'rgba(148, 163, 184, 0.15)',
    bg: 'rgba(148, 163, 184, 0.1)',
    bgDark: 'rgba(41, 55, 77, 0.8)'
  },
} as const


const THEME_STORAGE_KEY = '@pigmeus_theme_color';
// Definimos el tipo basado en las llaves del objeto para evitar errores de indexado
type ThemeColor = keyof typeof THEME_PALETTE;

interface ThemeContextType {
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
  colors: typeof THEME_PALETTE[ThemeColor];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeColor, setThemeColor] = useState<ThemeColor>('ocean');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        // Validación de seguridad para asegurar que el string sea una llave válida
        if (saved && saved in THEME_PALETTE) {
          setThemeColor(saved as ThemeColor);
        }
      } catch (e) { 
        console.error("Error cargando tema local:", e); 
      }
    };
    loadTheme();
  }, []);

  const handleSetThemeColor = async (color: ThemeColor) => {
    setThemeColor(color);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, color);
    } catch (e) { 
      console.error("Error persistiendo tema:", e); 
    }
  };

  // Centralizamos la inyección de variables dinámicas
  const themeVars = vars({
    '--color-primary': THEME_PALETTE[themeColor].primary,
    '--color-primary-dark': THEME_PALETTE[themeColor].dark,
    '--color-primary-soft': THEME_PALETTE[themeColor].soft,
    '--color-bg-light': THEME_PALETTE[themeColor].bg,
    '--color-bg-dark': THEME_PALETTE[themeColor].bgDark,
  });

  return (
    <ThemeContext.Provider value={{ 
      themeColor, 
      setThemeColor: handleSetThemeColor, 
      colors: THEME_PALETTE[themeColor] 
    }}>
      {/* Aplicamos las variables al View raíz de la navegación */}
      <View style={themeVars} className="flex-1">
        {children}
      </View>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme debe usarse dentro de ThemeProvider');
  return context;
};