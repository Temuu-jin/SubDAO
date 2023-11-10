/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      solanaPurple: '#9945FF',
      solanaGreen: '#14F195',
      ePurple: '#CC00FA',
      eViolet: '#9A00FA',
      grey: '#D9D9D9',
    },
    screens: {
      sm: '320px',
      // => @media (min-width: 320px) { ... }

      md: '640px',
      // => @media (min-width: 640px) { ... }

      lg: '960px',
      // => @media (min-width: 960px) { ... }

      xl: '1440px',
      // => @media (min-width: 1440px) { ... }

      '2xl': '1888px',
      // => @media (min-width: 1888px) { ... }
    },
  },
  plugins: [],
};
