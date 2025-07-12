/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",   // <- if you're using /app router
    "./pages/**/*.{js,ts,jsx,tsx}", // <- if you're using /pages router
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'scroll-left': 'slide-left-loop 5s linear infinite',
      },
      keyframes: {
        'slide-left-loop': {
          '0%': { backgroundPosition: '100% 0' },
          '100%': { backgroundPosition: '0% 0' },
        },
      },
    },
  },
  plugins: [],
};
