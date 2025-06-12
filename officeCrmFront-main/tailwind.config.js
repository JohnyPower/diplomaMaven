/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',    // Основний колір (синій)
        secondary: '#9333EA',  // Другорядний (фіолетовий)
        accent: '#F59E0B',     // Акцентний (жовтий)
        background: '#F3F4F6', // Фон
        textPrimary: '#1F2937', // Основний текст
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'btn': '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
