/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope_400Regular', 'System', 'sans-serif'],
        medium: ['Manrope_500Medium', 'sans-serif'],
        bold: ['Manrope_700Bold', 'sans-serif'],
        extrabold: ['Manrope_800ExtraBold', 'sans-serif'],
      },

      colors: {
        primary: {
          // 'var(--color-primary)' permite que el ThemeContext cambie el color en tiempo real
          DEFAULT: 'var(--color-primary)', 
          dark: 'var(--color-primary-dark)',
          foreground: '#FFFFFF',
        },

        background: {
          light: '#f8fafc',
          dark: '#0f172a', 
        },

        surface: {
          light: '#ffffff',
          dark: '#1e293b',   
          secondary: '#334155', 
          darker: '#0f172a',
        },

        border: {
          light: '#f1f5f9',
          dark: '#334155',
        },

        text: {
          primary: '#0f172a',   
          secondary: '#64748b', 
          inverse: '#f1f5f9',         
          'inverse-secondary': '#94a3b8', 
          'inverse-tertiary': '#64748b',  
        },

        status: {
          success: '#22c55e',
          'success-soft': '#22c55e15',
          danger: '#ef4444',
          'danger-soft': '#ef444415',
          info: 'var(--color-primary)', // El color de info ahora también sigue al tema
          'info-soft': 'var(--color-primary-soft)', // Para fondos suaves de iconos
        },
      },

      boxShadow: {
        'soft': '0 2px 15px -3px rgba(19, 200, 236, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
      },

      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        'full': '9999px',
      }
    },
  },
  plugins: [],
}