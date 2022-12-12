/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/pages/festivals/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    theme: {
      screens: {
        'sm': {'max': '640px'},
        // => @media (max-width: 640px) { ... }

        'md': {'max': '768px'},
        // => @media (max-width: 768px) { ... }

        'lg': {'max': '1024px'},
        // => @media (max-width: 1024px) { ... }

        'xl': {'max': '1280px'},
        // => @media (max-width: 1280px) { ... }
      }
    },
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
          9: '#666666',
        },
        red: '#CC0000',
        'cardBg': '#2f2f2f',
        'navBlack': '#141414',
        teal: '#54B9C5'
      }
    },
  },
  plugins: [],
}