/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          500: '#F43F5E',
          600: '#E11D48',
          700: '#BE123C',
          800: '#9F1239',
          900: '#881337',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: { 
          '0%': { opacity: '0' }, 
          '100%': { opacity: '1' } 
        },
        slideUp: { 
          '0%': { transform: 'translateY(20px)', opacity: '0' }, 
          '100%': { transform: 'translateY(0)', opacity: '1' } 
        },
      }
    }
  },
  plugins: [],
}