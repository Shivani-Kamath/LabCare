/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial']
      },
      colors: {
        // AIET-style blue/white/grey palette
        canvas: '#f5f7fb',
        surface: '#ffffff',
        ink: '#0a142f',
        brand: {
          DEFAULT: '#46923c',
          50: '#f0f9f0',
          100: '#ddf2dd',
          200: '#bce5bc',
          300: '#8dd18d',
          400: '#5bb85b',
          500: '#46923c',
          600: '#3a7a32',
          700: '#2f6129',
          800: '#244820',
          900: '#1a2f18'
        },
        accent: {
          DEFAULT: '#20c997',
          600: '#16a77e'
        },
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      boxShadow: {
        card: '0 10px 25px -5px rgba(0,0,0,0.25), 0 8px 10px -6px rgba(0,0,0,0.2)'
      }
    },
  },
  plugins: [],
}