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
          primary: '#43766C',    // Elegant Sage Green
          secondary: '#F8FAE5',  // Soft Cream/Vanilla
          dark: '#1A202C',       // Modern Dark Gray (Text)
          light: '#F7FAFC',      // Clean White-Blue background
          accent: '#B19470',     // Gold/Biscuit color for accents
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Ensure you have a clean font (optional)
      }
    },
  },
  plugins: [],
}