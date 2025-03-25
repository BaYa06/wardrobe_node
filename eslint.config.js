import globals from 'globals';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
        ...globals.browser,
      },
    },
    rules: {
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'no-unused-vars': 'error',
    },
    ignores: ['node_modules/**', 'dist/**'],
  },
];