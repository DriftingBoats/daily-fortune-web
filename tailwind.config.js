/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#B45309',
          light: '#D97706',
          dark: '#92400E',
        },
        secondary: '#CA8A04',
        accent: '#A16207',
        fortune: {
          bg: '#FFFBEB',
          card: '#FFFFFF',
          light: '#FEF3C7',
          border: '#FDE68A',
        },
        text: {
          primary: '#451A03',
          secondary: '#78350F',
          muted: '#A16207',
        }
      },
      fontFamily: {
        sans: ['Noto Sans SC', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
