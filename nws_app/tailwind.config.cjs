/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure it includes all JS/JSX/TS/TSX files in the src directory
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans', 'sans-serif'], // Add Noto Sans font
      },
    },
  },
  plugins: [],
};
