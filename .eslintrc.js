module.exports = {
  root: true,
  env: { node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/recommended',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  rules: {
    // Interface type delimiters must be none: https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/member-delimiter-style.md
    '@typescript-eslint/member-delimiter-style': ['error', { multiline: { delimiter: 'none' } }]
  }
}
