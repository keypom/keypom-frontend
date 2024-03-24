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
    'plugin:react/jsx-runtime',
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
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    endOfLine: 'off',
    'react/react-in-jsx-scope': 'off',
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
    '@typescript-eslint/no-misused-promises': 'off',
    camelcase: 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    'prettier/prettier': 'error',
    'simple-import-sort/exports': 'error',
    'react/no-unescaped-entities': 'off',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'unused-imports/no-unused-imports': 'error',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    'import/order': [
      'warn',
      {
        pathGroups: [
          {
            pattern: '@/**',
            group: 'external',
            position: 'after',
          },
        ],
        'newlines-between': 'always',
      },
    ],
    '@typescript-eslint/strict-boolean-expressions': [
      'warn',
      {
        allowNullableBoolean: true,
        allowNullableString: true,
        allowNullableNumber: true,
        allowAny: true,
        allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: true,
      },
    ],
    '@typescript-eslint/restrict-template-expressions': [
      'error',
      {
        allowNullish: true,
      },
    ],
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
  },
};
