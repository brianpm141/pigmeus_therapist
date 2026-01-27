import React, { createContext, useContext, useState, ReactNode } from 'react';
import { View } from 'react-native';
import { vars } from "nativewind"; 

export const THEME_PALETTE = {
  azul:   { primary: '#13c8ec', dark: '#0ea5c3', soft: 'rgba(19, 200, 236, 0.15)' },
  morado: { primary: '#a855f7', dark: '#9333ea', soft: 'rgba(168, 85, 247, 0.15)' },
  rosa:   { primary: '#ec4899', dark: '#db2777', soft: 'rgba(236, 72, 153, 0.15)' },
  verde:  { primary: '#22c55e', dark: '#16a34a', soft: 'rgba(34, 197, 94, 0.15)' },
  gris:   { primary: '#64748b', dark: '#475569', soft: 'rgba(100, 116, 139, 0.15)' },
};

type ThemeColor = keyof typeof THEME_PALETTE;

interface ThemeContextType {
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
  colors: typeof THEME_PALETTE.azul;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeColor, setThemeColor] = useState<ThemeColor>('azul');

  // 1. CREAR LAS VARIABLES CON vars()
  const themeVars = vars({
    '--color-primary': THEME_PALETTE[themeColor].primary,
    '--color-primary-dark': THEME_PALETTE[themeColor].dark,
    '--color-primary-soft': THEME_PALETTE[themeColor].soft, 
  });

  const value = {
    themeColor,
    setThemeColor,
    colors: THEME_PALETTE[themeColor],
  };

  return (
    <ThemeContext.Provider value={value}>
      {/* 3. APLICAR themeVars AL STYLE */}
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