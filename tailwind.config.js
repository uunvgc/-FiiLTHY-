/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fiilthy: {
          gold: '#FFD700',
          black: '#0A0A0A',
          platinum: '#E5E4E2',
          crown: '#B8860B',
          dark: '#111111',
          darker: '#0A0A0A'
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        glow: {
          '0%, 100%': { textShadow: '0 0 20px #FFD700' },
          '50%': { textShadow: '0 0 60px #FFD700, 0 0 80px #FFD700' },
        }
      }
    },
  },
  plugins: [],
}
