/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hospital-blue': '#1e40af',
        'hospital-light-blue': '#3b82f6',
        'hospital-dark-blue': '#1e3a8a',
        'hospital-red': '#dc2626',
        'hospital-gold': '#f59e0b',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 