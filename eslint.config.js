import eslintPluginAstro from 'eslint-plugin-astro'
import tseslint from 'typescript-eslint'

export default [
  // Astro files: use astro-eslint-parser (includes embedded TS script blocks)
  ...eslintPluginAstro.configs['flat/recommended'],

  // TypeScript rules scoped to TS/TSX only — avoids re-parsing .astro with the TS parser
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ['**/*.ts', '**/*.tsx'],
  })),

  {
    ignores: ['dist/', '.astro/', 'cypress/', 'updateShows.mjs'],
  },
]
