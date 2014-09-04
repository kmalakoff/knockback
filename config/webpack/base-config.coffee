module.exports =
  module:
    loaders: [
      {test: /\.coffee$/, loader: 'coffee'}
      {test: /knockout\/build\/output\/knockout-latest\.debug\.js/, loader: 'imports?require=>false'}
    ]
    noParse: [
      /knockout\/build\/output\/knockout-latest\.debug\.js/
    ]

  resolve:
    root: '.'
    extensions: ['', '.coffee', '.js']
    moduleDirectories: ['node_modules']
