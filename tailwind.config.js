/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        app: {
          bg: '#0B0D12',
          panel: '#121620',
          elevated: '#191F2B',
          hover: '#222A38',
          border: '#2B3444',
          subtle: '#1C2331',
        },
        text: {
          primary: '#F3F5F9',
          secondary: '#A3AEC0',
          muted: '#758198',
        },
        accent: {
          DEFAULT: '#8B7CFF',
          hover: '#7A69FA',
          active: '#B7AEFF',
          subtle: 'rgba(139, 124, 255, 0.15)',
        },
        status: {
          success: '#34C997',
          warning: '#F2B84B',
          error: '#F26B7A',
          info: '#65B8F7',
        },
        track: {
          narration: '#14B8A6',
          footage: '#3B82F6',
          images: '#6366F1',
          titles: '#8B5CF6',
          captions: '#F59E0B',
          music: '#10B981',
          sfx: '#F43F5E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Roboto Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        panel: '12px',
        editor: '8px',
        dialog: '16px',
      }
    },
  },
  plugins: [],
}
