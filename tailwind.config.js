const colors = require('./config/colors')

module.exports = {
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      primary: 'var(--color-primary)',
      secondary: 'var(--color-secondary)',
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      colors: colors,
      spacing: {
        96: '24rem',
        128: '32rem',
      },
    },
  },
  variants: {},
  plugins: [],
}
