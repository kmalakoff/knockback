{print} = require 'util'
{spawn} = require 'child_process'
fs = require 'fs'
path = require 'path'
yaml = require 'js-yaml'
wrench = require 'wrench'
_ = require 'underscore'
qunit = require 'qunit'

# CONFIG
LIBRARY_NAME = 'Knockback.js'
CONFIG = yaml.load(fs.readFileSync('config.yaml', 'utf8'))
JS_DIRS = ['test/_examples/build'].concat(_.map(CONFIG['test_dirs'], (dir)-> return "#{dir}/build"))
WEBSITE_DIRS = ['tutorials', 'docs', 'stylesheets', 'javascripts', 'images']
LIBRARY_NAMES = {development: 'knockback.js', production: 'knockback.min.js'}
TEST_TIMEOUT = 10000

timeLog = (message) ->
  console.log("#{(new Date).toLocaleTimeString()} - #{message}")

compileCoffee = (args, files_or_dir, options={}) ->
  args = if options.watch then _.flatten(['-w', args, '-c', files_or_dir]) else _.flatten([args, '-c', files_or_dir])

  coffee = spawn 'coffee', args
  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  if options.watch
    coffee.stdout.on 'data', (data) ->
      print data.toString() unless options.silent
      options.callback() if options.callback and options.watch
  else
    output_name = if ((index = _.indexOf(args, '-j')) < 0) then files_or_dir else args[index+1]
    filenames = _.clone(output_name) if _.isArray(output_name)
    coffee.on 'exit', (code) ->
      (if filenames then timeLog("compiled #{filenames.pop()}") else timeLog("compiled #{output_name}")) unless options.silent
      options.callback() if options.callback and code is 0

minify = (src, dest, options={}) ->
  uglifyjs = spawn 'uglifyjs', ['-o', dest, src]
  uglifyjs.on 'exit', (code) ->
    return unless code is 0
    timeLog("minified #{src}") unless options.silent
    options.callback?()

build = (options={}) ->
  callback_count=2; original_callback = options.callback; options = _.clone(options)
  options.callback = -> minify(LIBRARY_NAMES.development, LIBRARY_NAMES.production, {silent: options.silent, callback: original_callback}) if --callback_count<=0

  # library
  compileCoffee(['-j', LIBRARY_NAMES.development, '-o', '.'], CONFIG['library'], options)

  # examples
  compileCoffee(['-j', '_examples.js', '-o', 'test/_examples/build'], 'test/_examples', options)

  # tests
  for file in _.select(_.map(CONFIG['test_dirs'], (path)-> return (path + '/test.coffee')), (file)-> path.existsSync(file))
    callback_count++; compileCoffee(['-b', '-o', "#{path.dirname(file)}/build"], file, options)

clean = (options={}) ->
  # Library
  fs.unlink(name) for key, name of LIBRARY_NAMES

  # traverse and delete the library for examples and test files
  wrench.rmdirSyncRecursive(dir, true) for dir in JS_DIRS

  # remove website directories
  fs.unlink(dir) for dir in WEBSITE_DIRS
  timeLog("cleaned library #{LIBRARY_NAME}") unless options.silent

runHeadlessTest = (filename, options) ->
  phantomjs = spawn 'phantomjs', ['test/vendor/qunit/run-qunit.js', "file://#{fs.realpathSync(filename)}", TEST_TIMEOUT]
  phantomjs.stdout.on 'data', (data) ->
    process.stderr.write data.toString()
  phantomjs.on 'exit', (code) ->
    if code is 0
      timeLog("tests passed #{filename}") unless options.silent
    else
      timeLog("tests failed #{filename}")
    options.callback?()

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
    options.callback = -> timeLog("************tests finished************") if --callback_count<=0

    # run the tests
    for file in _.select(_.map(CONFIG['test_dirs'], (path)-> return (path + '/test-latest.html')), (file)-> path.existsSync(file))
      callback_count++; runHeadlessTest(file, options)
    for file in _.select(_.map(CONFIG['test_dirs'], (path)-> return (path + '/test-legacy_ko-1.2.1_bb-0.9.1.html')), (file)-> path.existsSync(file))
      callback_count++; runHeadlessTest(file, options)
  })