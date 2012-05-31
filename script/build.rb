# Run me with: 'ruby script/build.rb'
require 'rubygems'
require 'yaml'

PROJECT_ROOT = File.expand_path('../..', __FILE__)

config = YAML::load( File.open( 'config.yaml' ) )

####################################################
# Knockback Library
####################################################
coffee_files = config['library'].select {|file| file.end_with?('.coffee')}
`cd #{PROJECT_ROOT}; node_modules/.bin/coffee -j knockback.js -c #{coffee_files.join(' ')}`

####################################################
# Library for examples
####################################################
`cd #{PROJECT_ROOT}; node_modules/.bin/coffee -j test/_examples/build/_examples.js -c #{PROJECT_ROOT}/test/_examples`

####################################################
# Tests
####################################################
config['test_dirs'].each do |path|
  `cd #{PROJECT_ROOT}; node_modules/.bin/coffee -b -o #{path}/build -c #{path}`
end