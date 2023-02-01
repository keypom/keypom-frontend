/* eslint-disable semi */
/* eslint-disable comma-dangle */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    es6: true,
  },
  root: true,
  extends: [
    'plugin:react/recommended',
    'standard-with-typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    'react',
    'unused-imports',
    'simple-import-sort',
    'prettier',
    'import',
    '@typescript-eslint',
  ],
  rules: {
    'react/jsx-sort-props': [
      2,
      {
        callbacksLast: true,
        shorthandFirst: true,
        ignoreCase: true,
        reservedFirst: true,
      },
    ],
    'no-unused-vars': 'error',
    'no-console': 'warn',
    'prefer-const': [
      'error',
      {
        destructuring: 'any',
      },
    ],
    'react/no-unknown-property': ['error', { ignore: ['css', 'global', 'jsx'] }],
    'array-callback-return': [
      'error',
      {
        checkForEach: true,
      },
    ],
    '@typescript-eslint/no-empty-interface': 'off',
    'prettier/prettier': 'error',
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'unused-imports/no-unused-imports': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'import/order': [
      'warn',
      {
        pathGroups: [
          {
            pattern: '@/common/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/modules/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/pages/**',
            group: 'external',
            position: 'after',
          },
        ],
        'newlines-between': 'always',
      },
    ],
  },
};
