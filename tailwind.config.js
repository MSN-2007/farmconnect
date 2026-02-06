/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nature: {
          50: '#f2fcf2',
          100: '#e1f7e1',
          200: '#c3ecc3',
          300: '#95da95',
          400: '#5cbf5c',
          500: '#34a034',
          600: '#258025',
          700: '#206620',
          800: '#1e511e',
          900: '#194319',
          950: '#0a240a',
        },
        earth: {
          50: '#fbf8f5',
          100: '#f5efe8',
          200: '#ebdccf',
          300: '#dec2ab',
          400: '#cc9f80',
          500: '#be835d',
          600: '#b16a4a',
          700: '#93533d',
          800: '#794537',
          900: '#623a2f',
          950: '#351d17',
        }
      }
    },
  },
  plugins: [],
}
