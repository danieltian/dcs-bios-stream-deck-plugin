module.exports = {
  root: true,
  env: { node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/recommended'
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  rules: {
    // Interface type delimiters must be none: https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/member-delimiter-style.md
    '@typescript-eslint/member-delimiter-style': ['error', { multiline: { delimiter: 'none' } }],

    // else statement must be on its own separate line: https://eslint.org/docs/rules/brace-style
    'brace-style': ['error', 'stroustrup'],

    // Don't allow semi-colons at the end of each line: https://eslint.org/docs/rules/semi
    'semi': ['error', 'never'],

    // Don't allow spaces between array bracket and first/last items: https://eslint.org/docs/rules/array-bracket-spacing
    'array-bracket-spacing': ['error', 'never'],

    // Don't allow space between function and parameters: https://eslint.org/docs/rules/space-before-function-paren
    'space-before-function-paren': ['error', { named: 'never', anonymous: 'never' }],

    // Always require a space between { and }: https://eslint.org/docs/rules/object-curly-spacing
    'object-curly-spacing': ['error', 'always'],

    // Require spaces after commas for function parameters: https://eslint.org/docs/rules/comma-spacing
    'comma-spacing': ['error', { after: true }],

    // Require parenthesis around arrow function parameters: https://eslint.org/docs/rules/arrow-parens
    'arrow-parens': ['error', 'always'],

    // Require spaces around the arrow part of the arrow function: https://eslint.org/docs/rules/arrow-spacing
    'arrow-spacing': ['error', { before: true, after: true }],

    // Don't allow commas after the last item for objects and arrays: https://eslint.org/docs/rules/comma-dangle
    'comma-dangle': ['warn', 'never'],

    // Comments must have a space after the double-slash: https://eslint.org/docs/rules/spaced-comment
    'spaced-comment': ['warn', 'always', { block: { markers: ['!'] } }],

    // Comments must always start with a capital letter: https://eslint.org/docs/rules/capitalized-comments
    'capitalized-comments': ['warn', 'always', { ignoreConsecutiveComments: true }],

    // Quotes must be single quotes only: https://eslint.org/docs/rules/quotes
    'quotes': ['error', 'single']
  }
}
