/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        green: {
          500: '#1DB954',
          400: '#1ed760',
        },
      },
    },
  },
  plugins: [],
};