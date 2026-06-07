import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import vitest from 'eslint-plugin-vitest'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      vitest,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...vitest.environments.env.globals,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
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
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-vars': 'error',
      'react/prop-types': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
]