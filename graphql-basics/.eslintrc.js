module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: 'airbnb-base',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    /* Best Practices */
    'no-unused-expressions': ['error', { allowTaggedTemplates: true }],

    /* ECMAScript 6 */
    'arrow-parens': ['error', 'always'],
    'no-confusing-arrow': 0,
    'arrow-body-style': 0,

    /* Stylistic */
    indent: ['error', 2, { SwitchCase: 1 }],
    quotes: ['error', 'single', { avoidEscape: true }],
    'no-underscore-dangle': 0,
    'object-curly-newline': ['error', { consistent: true }],
    'operator-linebreak': 0,
    'implicit-arrow-linebreak': 0,
    'comma-dangle': [
      'warn',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'ignore',
      },
    ],
    'function-paren-newline': ['error', 'consistent'],
    'space-before-function-paren': 0,

    /* Variables */
    'no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'none',
        ignoreRestSiblings: false,
        caughtErrors: 'all',
      },
    ],
  },
};
