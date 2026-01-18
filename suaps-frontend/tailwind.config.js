/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        'suaps-blue': '#205187',
        'suaps-red': '#E33A3B',
      }
    },
  },
  plugins: [],
};