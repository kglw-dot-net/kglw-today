import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      colors: {
        // Name That Color: https://chir.ag/projects/name-that-color
        // name schema: `${basicColorName}-${nameThatColorValue}`
        'blue-gothic': '#70969f',
        'green-mantis': '#8ac755',
      },
    },
  },

  plugins: [typography, forms, containerQueries]
} satisfies Config;
