/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'Roboto', 'sans-serif'],
      },
      colors: {
        'bauhaus-red': '#DC143C',
        'bauhaus-blue': '#0047AB',
        'off-white': '#FAFAFA',
        'lead-gray': '#333333',
      }
    },
  },
  plugins: [],
}
