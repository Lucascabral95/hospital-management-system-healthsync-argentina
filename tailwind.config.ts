import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/**/*.{html,ts}',
    './public/index.html'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
} satisfies Config;
