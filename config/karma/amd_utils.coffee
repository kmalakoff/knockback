path = require 'path'
fs = require 'fs'
_ = require 'underscore'

SHIMS =
  underscore: {exports: '_'}
  backbone: {exports: 'Backbone', deps: ['underscore']}

coffeescript = require 'coffee-script'

module.exports = class AMDUtils
  @extractAMDOptionsForFiles: (files) ->
    options = {paths: {}, shim:{}}

    for file in files
      file_name = file.split('/').pop()
      file_name = file_name.split('-').shift() if (file_name.indexOf('knockback-') < 0) or (file_name is 'knockback-core.js')
      file_name = file_name.replace('.js', '')
      options.paths[file_name] = file.slice(0, -path.extname(file).length)

    options.shim[key] = value for key, value of SHIMS when options.paths.hasOwnProperty(key)

    return options

  @wrapTests: (test_file, files, callback) ->
    amd_options = AMDUtils.extractAMDOptionsForFiles(files)

    callback(null, """
(function() {
  require.config(#{JSON.stringify(amd_options,null,2)});

  require(#{JSON.stringify(_.keys(amd_options.paths))}, function(){
    window._ = window.Backbone = window.ko = window.kb = null; // force each test to require dependencies synchronously
    #{coffeescript.compile(fs.readFileSync(test_file, 'utf8'))}
  });
}).call(this);
    """)
