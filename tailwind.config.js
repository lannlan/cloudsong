/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        nimbus: ['Nimbus Sans', '-apple-system', 'Roboto', 'Helvetica', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#0f172a',
        },
      },
      backgroundImage: {
        'gradient-pink': 'linear-gradient(125deg, #fdf2f8 0%, #ffffff 100%)',
        'gradient-blue': 'linear-gradient(90deg, #eff6ff 0%, #eef2ff 100%)',
        'gradient-forecast': 'linear-gradient(135deg, #fdf2f8 0%, #ffffff 100%)',
      },
      boxShadow: {
        pink: '0 8px 20px 0 rgba(236, 72, 153, 0.20)',
        forecast: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
