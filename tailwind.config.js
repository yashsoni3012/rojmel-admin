/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  corePlugins: { preflight: false }, // MUI CssBaseline handles the reset
  theme: {
    extend: {
      colors: {
        ink: '#18233F',
        canvas: '#F4F6FB',
        income: '#0E9F6E',
        expense: '#E5484D',
        saving: '#3B82F6',
        petrol: '#F59E0B',
      },
      fontFamily: { sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
