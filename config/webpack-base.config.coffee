module.exports =
  module:
    loaders: [{test: /\.coffee$/, loader: 'coffee'}]

  resolve:
    root: '.'
    extensions: ['', '.coffee', '.js']
    moduleDirectories: ['node_modules']
