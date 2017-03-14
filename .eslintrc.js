module.exports = {
  'extends': 'airbnb-base',
  'plugins': [
    'import'
  ],
  'env': {
    'es6': true,
    'node': true,
    'mocha': true
  },
  'rules': {
    // http://eslint.org/docs/rules/max-len
    'max-len': ['error', 200, 2],

    // http://eslint.org/docs/rules/camelcase
    'camelcase': 'off',

    // http://eslint.org/docs/rules/no-underscore-dangle
    'no-underscore-dangle': 'off',

    // http://eslint.org/docs/rules/no-underscore-dangle
    'import/no-unresolved': 'off',
  }
};