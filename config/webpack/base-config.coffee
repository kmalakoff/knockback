module.exports =
  module:
    loaders: [
      {test: /\.coffee$/, loader: 'coffee'}
      {test: /knockout.build.output.knockout-latest\.js/, loader: 'imports?require=>false'}
    ]

  resolve:
    root: '.'
    extensions: ['', '.coffee', '.js']
    moduleDirectories: ['node_modules']
