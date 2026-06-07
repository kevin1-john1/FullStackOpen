import js from '@eslint/js'
import globals from 'globals'

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
      indent: ['error', 2],
      'linebreak-style': 0,
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      eqeqeq: 'error',
      'arrow-spacing': 'error',
      'no-console': 0,
    },
  },
]