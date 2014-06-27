path = require 'path'
fs = require 'fs'
_ = require 'underscore'
es = require 'event-stream'

gulp = require 'gulp'
File = require('gulp-util').File
compile = require 'gulp-compile-js'

extractAMDOptions = (options) ->
  files = options.files or []
  shims = options.shims or {}
  amd_options = {paths: {}, shim:{}}

  for file in files
    name = file.split('/').pop()
    name = options.name(name) if options.name
    name = name.replace('.js', '')
    amd_options.paths[name] = path.join(options.base or '/base', file.replace('.js', ''))

  amd_options.shim[key] = value for key, value of shims when amd_options.paths.hasOwnProperty(key)
  return amd_options

toText = (callback) ->
  text = ''
  es.through ((data) => text += data), (-> callback(text))

# TODO: errors for missing options like files
module.exports = (options={}) ->
  es.map((file, callback) ->
    amd_options = extractAMDOptions(options)

    es.readArray([file])
      .pipe(compile({coffee: {bare: true}}))
      .pipe es.map (file, wrap_callback) ->
        file.pipe toText (text) ->
          contents = """
            (function() {
              #{'var _start = window.__karma__.start, _config; window.__karma__.start = function(config) { _config = config; };' if options.karma}

              require.config(#{JSON.stringify(amd_options,null,2)});

              require(#{JSON.stringify(_.keys(amd_options.paths))}, function(){
                #{options.post_load or ''}
                #{text}

                #{'_start(_config);' if options.karma}
              });
            }).call(this);
          """

          wrap_callback(); callback(null, new File(_.extend(_.pick(file, 'cwd', 'base', 'path'), {contents: new Buffer(contents)})))
      )
