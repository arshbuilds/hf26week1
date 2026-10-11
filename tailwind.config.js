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
          50: '#f2f9f1',
          100: '#e1f2df',
          200: '#c3e5bf',
          300: '#97d191',
          400: '#64b65c',
          500: '#419939',
          600: '#307b2a',
          700: '#276223',
          800: '#234e20',
          900: '#1e411c',
          950: '#0c230b',
        },
        adventure: {
          amber: '#f59e0b',
          crimson: '#e11d48',
          sky: '#0284c7',
          forest: '#15803d',
        }
      },
    },
  },
  plugins: [],
}
