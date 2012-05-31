{print} = require 'util'
{spawn} = require 'child_process'
fs = require 'fs'
path = require 'path'
yaml = require 'js-yaml'
wrench = require 'wrench'
_ = require 'underscore'

# CONFIG
CONFIG = yaml.load(fs.readFileSync('config.yaml', 'utf8'))
JS_DIRS = ['test/_examples/build'].concat(_.map(CONFIG['test_dirs'], (dir)-> return "#{dir}/build"))
WEBSITE_DIRS = ['tutorials', 'docs', 'stylesheets', 'javascripts', 'images']
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

clean = ->
  # Library
  fs.unlink(name) for key, name of LIBRARY_NAMES

  # traverse and delete the library for examples and test files
  wrench.rmdirSyncRecursive(dir, true) for dir in JS_DIRS

  # remove website directories
  fs.unlink(dir) for dir in WEBSITE_DIRS

##############################
# COMMANDS
##############################
task 'clean', 'Remove generated JavaScript files',  -> clean()
task 'build', 'Build library and tests',            -> clean(); build(false) # just build
task 'watch', 'Watch library and tests',            -> clean(); build(true) # build with watch