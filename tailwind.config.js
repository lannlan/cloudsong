/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        limelight: ['Limelight', '-apple-system', 'Roboto', 'Helvetica', 'sans-serif'],
        inter: ['Inter', '-apple-system', 'Roboto', 'Helvetica', 'sans-serif'],
        nimbus: ['Nimbus Sans', '-apple-system', 'Roboto', 'Helvetica', 'sans-serif'],
      },
      colors: {
        pink: {
          500: '#ec4899',
        },
      },
      backgroundImage: {
        'hero-pattern': 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4))',
      },
    },
  },
  plugins: [],
}
