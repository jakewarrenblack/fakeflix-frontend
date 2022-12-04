/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/pages/festivals/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Montserrat', 'Helvetica', 'Arial', 'sans-serif']
      },
      colors: {
        grey: {
          1: '#808080',
          2: '#141414',
          3: '#333333',
          4: '#E5E5E5',
          5: '#B3B3B3',
          6: '#6C6C6D',
          7: '#E6E6E6',
          8: '#181818',
        },
        red: '#CC0000',
        'navBlack': '#141414',
        teal: '#54B9C5'
      }
    },
  },
  plugins: [],
}