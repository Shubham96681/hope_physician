/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#004aad',
          50: '#e6f0ff',
          100: '#b3d1ff',
          200: '#80b2ff',
          300: '#4d93ff',
          400: '#1a74ff',
          500: '#004aad',
          600: '#003b8a',
          700: '#002c67',
          800: '#001d44',
          900: '#000e21',
        },
        secondary: {
          DEFAULT: '#0057bb',
          50: '#e6f2ff',
          100: '#b3d9ff',
          200: '#80c0ff',
          300: '#4da7ff',
          400: '#1a8eff',
          500: '#0057bb',
          600: '#004695',
          700: '#003570',
          800: '#00234a',
          900: '#001225',
        },
      },
    },
  },
  plugins: [],
}

