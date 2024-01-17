module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  ignorePatterns: ['**/graphql.ts'],

  plugins: ['@typescript-eslint', 'simple-import-sort', 'unused-imports', 'prettier'],
  extends: ['eslint:recommended', 'google', 'plugin:@typescript-eslint/recommended', 'prettier'],

  rules: {
    'prettier/prettier': 'error',
    'no-unused-vars': 'off',
    'no-console': 'error',
    'require-jsdoc': 'off',
    'valid-jsdoc': 'off',

    '@typescript-eslint/no-unnecessary-type-constraint': 'off',
    '@typescript-eslint/no-empty-function': 'off',

    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/no-var-requires': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react/no-unused-prop-types': 0,
    '@typescript-eslint/ban-ts-comment': 0,

    camelcase: 'error',
    // #region  //*=========== Unused Import ===========
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'warn',

    'unused-imports/no-unused-vars': [
      'off',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    // #endregion  //*======== Unused Import ===========
    // #region  //*=========== Import Sort ===========
    'simple-import-sort/exports': 'warn',
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          // ext library & side effect imports
          ['^@?\\w', '^\\u0000'], // {s}css files
          ['^.+\\.s?css$'], // Lib and hooks
          ['^@/lib', '^@/hooks'], // static data
          ['^@/data'], // components
          ['^@/components', '^@/container'], // zustand store
          ['^@/store'], // Other imports
          ['^@/'], // relative paths up until 3 level
          [
            '^\\./?$',
            '^\\.(?!/?$)',
            '^\\.\\./?$',
            '^\\.\\.(?!/?$)',
            '^\\.\\./\\.\\./?$',
            '^\\.\\./\\.\\.(?!/?$)',
            '^\\.\\./\\.\\./\\.\\./?$',
            '^\\.\\./\\.\\./\\.\\.(?!/?$)',
          ],
          ['^@/types'], // other that didn't fit in
          ['^'],
        ],
      },
    ], // #endregion  //*======== Import Sort ===========
  },
  globals: {
    React: true,
    JSX: true,
  },
};
