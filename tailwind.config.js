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
      colors: {
        'gray-1': '#333333',
        'gray-2': '#4F4F4F',
        'gray-3': '#828282',
        'gray-4': '#BDBDBD',
        'gray-5': '#E0E0E0',
        'gray-6': '#F2F2F2',
        'red-1': '#EB5757',
        'orange-1': '#F2994A',
        'yellow-1': '#F2C94C',
        'green-1': '#219653',
        'green-2': '#27AE60',
        'green-3': '#6FCF97',
        'blue-1': '#02174E',
        'blue-2': '#2F80ED',
        'blue-3': '#2D9CDB',
        'blue-4': '#2D9CDB',
        'cyan-1': '#9cdbff',
      },
      spacing: {
        96: '24rem',
        128: '32rem',
      },
    },
  },
  variants: {},
  plugins: [],
}
