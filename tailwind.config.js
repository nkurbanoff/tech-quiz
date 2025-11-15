/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#64748b',
        secondary: '#475569',
        accent: '#94a3b8',
      },
    },
  },
  plugins: [],
}
