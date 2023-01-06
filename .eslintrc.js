module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'next/core-web-vitals',
  ],
  env: { es6: true },
  rules: {
    'prefer-const': [
      'error',
      {
        destructuring: 'any',
      },
    ],
    'no-console': ['warn'],
    'react/no-unknown-property': ['error', { ignore: ['css', 'global', 'jsx'] }],
    '@next/next/no-img-element': 'off',
    'react/jsx-sort-props': [
      2,
      {
        callbacksLast: true,
        shorthandFirst: true,
        ignoreCase: true,
        reservedFirst: true,
      },
    ],

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
        ],
        'newlines-between': 'always',
      },
    ],
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
  },
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    'unused-imports',
    '@next/next',
    '@typescript-eslint',
    'prettier',
    'react',
    'simple-import-sort',
    'import',
  ],
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
};
