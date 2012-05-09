# Run me with: 'ruby script/build.rb'
require 'rubygems'
require 'yaml'

PROJECT_ROOT = File.expand_path('../..', __FILE__)

####################################################
# Knockback Library
####################################################
`cd #{PROJECT_ROOT}; node_modules/.bin/coffee -b -o build -c #{PROJECT_ROOT}/src`
`cd #{PROJECT_ROOT}; jammit -c config/assets.yaml -o .`

####################################################
# Library for examples
####################################################
`cd #{PROJECT_ROOT}; node_modules/.bin/coffee -b -o examples_lib/build -c #{PROJECT_ROOT}/examples_lib`
`cd #{PROJECT_ROOT}; jammit -c config/assets_examples_lib.yaml -o #{PROJECT_ROOT}/examples_lib/build`

####################################################
# Tests
####################################################
config = YAML::load( File.open( 'config/config.yaml' ) )
if config && config['test_dirs']
  config['test_dirs'].each do |path|
    `cd #{PROJECT_ROOT}; node_modules/.bin/coffee -b -o #{path}/build -c #{path}`
  end
end