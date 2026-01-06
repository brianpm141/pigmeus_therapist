/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // 1. TIPOGRAFÍA (Agregada: Manrope)
      fontFamily: {
        sans: ['Manrope_400Regular', 'System', 'sans-serif'],
        medium: ['Manrope_500Medium', 'sans-serif'],
        bold: ['Manrope_700Bold', 'sans-serif'],
        extrabold: ['Manrope_800ExtraBold', 'sans-serif'],
      },

      // 2. COLORES
      colors: {
        // Principal (Marca)
        primary: {
          DEFAULT: '#13c8ec', // Acción principal, enlaces, iconos activos, botones primarios
          dark: '#0ea5c3',    // Estado Hover/Active del color primario
          foreground: '#FFFFFF', // Texto sobre fondo primario
        },

        // Fondos de Pantalla (Backgrounds)
        background: {
          light: '#f6f8f8', // Fondo general de pantallas en Modo Claro
          dark: '#101f22',  // Fondo general de pantallas en Modo Oscuro
        },

        // Superficies (Tarjetas, Inputs, Modales)
        surface: {
          light: '#ffffff', // Contenedor de tarjetas y campos en Modo Claro
          dark: '#192b2e',  // Contenedor de tarjetas y campos en Modo Oscuro
          darker: '#142225', // Headers, NavBars o elementos de contraste en Modo Oscuro
        },

        // Bordes (Separadores, Outlines de Inputs)
        border: {
          light: '#e2e8f0', // Color de borde sutil en Modo Claro
          dark: '#334155',  // Color de borde sutil en Modo Oscuro
        },

        // Estados (Feedback al usuario)
        status: {
          success: '#22c55e', // Operación exitosa, Completado
          warning: '#fb923c', // Alerta, Pendiente, En proceso
          danger: '#ef4444',  // Error, Eliminar, Acción destructiva
          new: '#a855f7',     // Elemento nuevo o destacado
        },

        // Texto (Contenido legible)
        text: {
          primary: '#0f172a',   // Texto principal, títulos (Modo Claro)
          secondary: '#94a3b8', // Subtítulos, hints, placeholders (Ambos modos)
          inverse: '#e2e8f0',   // Texto principal sobre fondos oscuros (Modo Oscuro)
        },
      },

      // 3. BORDES REDONDEADOS (Movido fuera de 'colors')
      borderRadius: {
        DEFAULT: '4px',
        lg: '8px',
        xl: '12px',      // Estándar de tus inputs
        '2xl': '16px',
        '3xl': '24px',
      }
    },
  },
  plugins: [],
}