{print} = require 'util'
{spawn} = require 'child_process'
fs = require 'fs'
path = require 'path'
yaml = require 'js-yaml'
walk = require 'walk'
_ = require 'underscore'

# CONFIG
CONFIG = yaml.load(fs.readFileSync('config.yaml', 'utf8'))
JS_DIRS = ['test/_examples/build'].concat(CONFIG['test_dirs'])
LIBRARY_NAMES = {development: 'knockback.js', production: 'knockback.min.js'}

build = (watch) ->
  # Knockback Library
  coffee = spawn 'coffee', (if watch then ['-w'] else []).concat(['-j', LIBRARY_NAMES.development, '-o', '.', '-c']).concat(CONFIG['library'])
  coffee.stderr.on 'data', (data) -> process.stderr.write data.toString()
  coffee.stdout.on 'data', (data) ->
    print data.toString()
    spawn 'uglifyjs', ['-o', LIBRARY_NAMES.production, LIBRARY_NAMES.development] if watch
  if not watch
    coffee.on 'exit', (code) ->
      spawn 'uglifyjs', ['-o', LIBRARY_NAMES.production, LIBRARY_NAMES.development] if code is 0

  # library for examples
  coffee = spawn 'coffee', (if watch then ['-w'] else []).concat(['-j', '_examples.js', '-o', 'test/_examples/build', '-c', 'test/_examples'])
  coffee.stderr.on 'data', (data) -> process.stderr.write data.toString()
  coffee.stdout.on 'data', (data) -> print data.toString()

  # tests
  for file in _.select(_.map(CONFIG['test_dirs'], (path)-> return (path + '/test.coffee')), (file)-> path.existsSync(file))
    coffee = spawn 'coffee', (if watch then ['-w'] else []).concat(['-b', '-o', "#{path.dirname(file)}/build", '-c', file])
    coffee.stderr.on 'data', (data) -> process.stderr.write data.toString()
    coffee.stdout.on 'data', (data) -> print data.toString()

task 'clean', 'Remove generated JavaScript files', ->
  # Knockback Library
  for key, name of LIBRARY_NAMES
    fs.unlink(name) if path.existsSync(name)

  # traverse and delete the library for examples and test files
  for index, pattern of JS_DIRS
    walk.walk(pattern, { followLinks: false }).on('file', (root, stat, next) ->
      fs.unlink("#{root}/#{stat.name}") if stat.name.match(/.js$/)
      next()
    )

task 'build', 'Build library and tests', -> build(false) # just build

task 'watch', 'Watch library and tests', -> build(true) # build with watch
