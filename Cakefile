{print} = require 'util'
{spawn} = require 'child_process'
fs = require 'fs'
path = require 'path'
yaml = require 'js-yaml'
wrench = require 'wrench'
_ = require 'underscore'

# CONFIG
LIBRARY_NAME = 'Knockback.js'
CONFIG = yaml.load(fs.readFileSync('config.yaml', 'utf8'))
JS_DIRS = ['test/_examples/build'].concat(_.map(CONFIG['test_dirs'], (dir)-> return "#{dir}/build"))
WEBSITE_DIRS = ['tutorials', 'docs', 'stylesheets', 'javascripts', 'images']
LIBRARY_NAME = 'knockback.js'
TEST_TIMEOUT = 10000

timeLog = (message) ->
  console.log("#{(new Date).toLocaleTimeString()} - #{message}")

compileCoffee = (args, files_or_dir, options={}) ->
  args = if options.watch then _.flatten(['-w', args, '-c', files_or_dir]) else _.flatten([args, '-c', files_or_dir])

  spawned = spawn 'coffee', args
  spawned.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  if options.watch
    spawned.stdout.on 'data', (data) ->
      print data.toString() unless options.silent
      options.callback?(0) if options.callback
  else
    output_name = if ((index = _.indexOf(args, '-j')) < 0) then files_or_dir else args[index+1]
    filenames = _.clone(output_name) if _.isArray(output_name)
    spawned.on 'exit', (code) ->
      (if filenames then timeLog("compiled #{filenames.pop()}") else timeLog("compiled #{output_name}")) unless options.silent
      options.callback?(code) if options.callback

minify = (src, options={}) ->
  spawned = spawn 'node_modules/.bin/uglifyjs', ['-o', "#{src.substr(0, src.lastIndexOf('.js'))}.min.js", src]
  spawned.on 'exit', (code) ->
    timeLog("minified #{src}") unless options.silent
    options.callback?(code) if options.callback

build = (options={}) ->
  callback_count=0; original_callback = options.callback; options = _.clone(options)
  options.callback = (code) ->
    options.callback?(code) if options.callback and not code is 0
    return if --callback_count>0
    minify(LIBRARY_NAME, {silent: options.silent, callback: original_callback})

  # library
  callback_count++; compileCoffee(['-j', LIBRARY_NAME, '-o', '.'], CONFIG['library'], options)

  # examples
  callback_count++; compileCoffee(['-j', '_examples.js', '-o', 'test/_examples/build'], 'test/_examples', options)

  # tests
  for file in _.select(_.map(CONFIG['test_dirs'], (path)-> return (path + '/test.coffee')), (file)-> path.existsSync(file))
    callback_count++; compileCoffee(['-b', '-o', "#{path.dirname(file)}/build"], file, options)

clean = (options={}) ->
  # Library
  fs.unlink(LIBRARY_NAME)

  # traverse and delete the library for examples and test files
  wrench.rmdirSyncRecursive(dir, true) for dir in JS_DIRS

  # remove website directories
  fs.unlink(dir) for dir in WEBSITE_DIRS
  timeLog("cleaned library #{LIBRARY_NAME}") unless options.silent

runHeadlessTest = (filename, options) ->
  spawned = spawn 'phantomjs', ['test/vendor/qunit/run-qunit.js', "file://#{fs.realpathSync(filename)}", TEST_TIMEOUT]
  spawned.stdout.on 'data', (data) ->
    process.stderr.write data.toString()
  spawned.on 'exit', (code) ->
    if code is 0
      timeLog("tests passed #{filename}") unless options.silent
    else
      timeLog("tests failed #{filename}")
    options.callback?(code)

##############################
# COMMANDS
##############################
option '-c', '--clean', 'clean the project'
option '-w', '--watch', 'watch for changes'
option '-s', '--silent', 'silence the console output'

task 'clean', 'Remove generated JavaScript files', (options) ->
  clean(options)

task 'build', 'Build library and tests', (options) ->
  clean({silent: options.silent}) if options.clean
  build({watch: options.watch})

task 'watch', 'Watch library and tests', (options) ->
  clean({silent: options.silent}) if options.clean
  build({watch: true})

task 'test', 'Test library', (options) ->
  clean(silent: options.silent)
  build({watch: options.watch, silent: options.silent, callback: ->
    # add headers
    timeLog("************tests started*************")
    callback_count=0; original_callback = options.callback; options = _.clone(options)
    result = 0    # collect test results
    options.callback = (code) ->
      result |= code
      return if --callback_count>0
      if result then timeLog("************tests failed**************") else timeLog("************tests succeeded***********")
      process.exit(result) unless options.watch

    # run the tests
    for file in _.select(_.map(CONFIG['test_dirs'], (path)-> return (path + '/test-latest.html')), (file)-> path.existsSync(file))
      callback_count++; runHeadlessTest(file, options)
    for file in _.select(_.map(CONFIG['test_dirs'], (path)-> return (path + '/test-legacy_ko-1.2.1_bb-0.9.1.html')), (file)-> path.existsSync(file))
      callback_count++; runHeadlessTest(file, options)
  })