module.exports = {
  entry: './src/core/index.coffee',
  output: {
    path: './',
    filename: 'knockback-core.js',
    library: 'knockback',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      { test: /\.coffee$/, loader: 'coffee' }
    ]
  },
  resolve: {
    root: './src',
    extensions: ['', '.web.coffee', '.web.js', '.coffee', '.js'],
    moduleDirectories: ['node_modules']
  },

  externals: {
    "underscore": "_",
    "backbone": "Backbone",
    "knockout": "ko",
    "jquery": "jQuery",

    "../defaults/default-observable": "default-observable",
    "../formatting/formatted-observable": "formatted-observable",
    "../localization/localized-observable": "localized-observable",
    "../statistics/statistics": "statistics",
    "../triggering/triggered-observable": "triggered-observable",
    "../validation/validation": "validation"
  }
}