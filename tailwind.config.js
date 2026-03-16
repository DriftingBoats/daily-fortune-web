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
          DEFAULT: '#b85c38',  // rust
          light: '#d17650',
          dark: '#8d4226',
        },
        secondary: '#5a6e5c',  // sage
        accent: '#b85c38',
        fortune: {
          bg: '#f5f0e8',       // warm cream
          card: '#faf7f1',
          light: '#efe7da',
          border: '#ddd5c8',
        },
        text: {
          primary: '#171411',
          secondary: '#6e6357',
          muted: '#9a8e83',
        }
      },
      fontFamily: {
        sans: ['Noto Sans SC', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
