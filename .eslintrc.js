module.exports = {
  extends: 'airbnb-base',
  plugins: ['import'],
  env: {
    browser: true,
    es6: true,
    node: true,
    mocha: true
  },
  rules: {
    'max-len': ['error', 200, 2],
    'no-underscore-dangle': 'off',
    'import/no-unresolved': 'off',
    'global-require': 'off',
    'no-nested-ternary': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-plusplus': 'off',
    'class-methods-use-this': 'off',
    'no-bitwise': 'off',
    'no-use-before-define': 'off',
    'no-new': 'off',
    'func-names': 'off',

    'camelcase': 'off',
  }
};