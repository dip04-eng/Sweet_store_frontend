
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'xxs': '320px',
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        // Custom breakpoints for specific needs
        'mobile': { 'max': '767px' },
        'tablet': { 'min': '768px', 'max': '1023px' },
        'desktop': { 'min': '1024px' },
        // Ultra-small screens (folded phones, small devices)
        'ultra-small': { 'max': '359px' },
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
  plugins: [
    function ({ addUtilities, addComponents }) {
      const newUtilities = {
        '.touch-manipulation': {
          'touch-action': 'manipulation',
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.safe-area-insets': {
          'padding-top': 'env(safe-area-inset-top)',
          'padding-bottom': 'env(safe-area-inset-bottom)',
          'padding-left': 'env(safe-area-inset-left)',
          'padding-right': 'env(safe-area-inset-right)',
        },
      };

      const newComponents = {
        '.container-responsive': {
          'max-width': '100%',
          'margin-left': 'auto',
          'margin-right': 'auto',
          'padding-left': '1rem',
          'padding-right': '1rem',
          '@screen sm': {
            'max-width': '640px',
            'padding-left': '1.5rem',
            'padding-right': '1.5rem',
          },
          '@screen md': {
            'max-width': '768px',
            'padding-left': '2rem',
            'padding-right': '2rem',
          },
          '@screen lg': {
            'max-width': '1024px',
            'padding-left': '2.5rem',
            'padding-right': '2.5rem',
          },
          '@screen xl': {
            'max-width': '1280px',
          },
          '@screen 2xl': {
            'max-width': '1536px',
          },
        },
        '.grid-responsive': {
          'grid-template-columns': 'repeat(1, minmax(0, 1fr))',
          '@screen sm': {
            'grid-template-columns': 'repeat(2, minmax(0, 1fr))',
          },
          '@screen md': {
            'grid-template-columns': 'repeat(3, minmax(0, 1fr))',
          },
          '@screen lg': {
            'grid-template-columns': 'repeat(4, minmax(0, 1fr))',
          },
        },
      };

      addUtilities(newUtilities);
      addComponents(newComponents);
    },
  ],
};