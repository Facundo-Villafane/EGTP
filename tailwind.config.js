/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#dde8ff',
          200: '#c3d4ff',
          300: '#9db5fe',
          400: '#758bfb',
          500: '#5563f6',
          600: '#3d3eeb',
          700: '#322ed0',
          800: '#2b28a8',
          900: '#282884',
        },
        accent: {
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
