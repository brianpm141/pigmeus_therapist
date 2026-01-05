/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
        colors: {
        // --- TEMA DE TU REFERENCIA ---
        primary: {
          DEFAULT: '#13c8ec', // Tu Cyan principal
          dark: '#0ea5c3',    // Tu Cyan oscuro (hover/active)
          foreground: '#FFFFFF', 
        },
        
        // Fondos (Backgrounds)
        background: {
          light: '#f6f8f8', // Tu fondo claro
          dark: '#101f22',  // Tu fondo oscuro principal
        },

        // Superficies (Tarjetas/Headers)
        surface: {
          light: '#ffffff', // Tu tarjeta clara
          dark: '#192b2e',  // Tu tarjeta oscura normal
          darker: '#142225', // Tu header/nav oscuro
        },

        // --- COLORES COMPLEMENTARIOS (Extraídos de tus clases HTML) ---
        // Vi que usas slate-900, green-500, red-500, orange-400 en el HTML.
        // Tailwind los incluye por defecto, pero aquí definimos alias semánticos
        // para mantener la arquitectura limpia.
        status: {
          success: '#22c55e', // green-500 (Confirmado)
          warning: '#fb923c', // orange-400 (Pendiente)
          danger: '#ef4444',  // red-500 (Notificaciones/Error)
          new: '#a855f7',     // purple-500 (Paciente Nuevo)
        },
        
        // Texto específico de tu modo oscuro
        text: {
          primary: '#e2e8f0', // slate-200
          secondary: '#94a3b8', // slate-400
        },
        borderRadius: {
        DEFAULT: '4px',  // 0.25rem
        lg: '8px',       // 0.5rem
        xl: '12px',      // 0.75rem
        '2xl': '16px',   // 1rem
        '3xl': '24px',   // (Extra para botones grandes)
      }
      },
    },
  },
  plugins: [],
}