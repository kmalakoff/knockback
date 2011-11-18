# Run me with: 'ruby script/build.rb'
require 'rubygems'
PROJECT_ROOT = File.expand_path('../..', __FILE__)

####################################################
# Knockback Library
####################################################
`cd #{PROJECT_ROOT}; coffee -b -o build -c #{PROJECT_ROOT}/src`
`cd #{PROJECT_ROOT}; jammit -c config/assets.yaml -o .`

####################################################
# Library for examples
####################################################
`cd #{PROJECT_ROOT}; coffee -b -o examples_lib/build -c #{PROJECT_ROOT}/examples_lib`
`cd #{PROJECT_ROOT}; jammit -c config/assets_examples_lib.yaml -o #{PROJECT_ROOT}/examples_lib/build`

####################################################
# Tests
####################################################
`cd #{PROJECT_ROOT}; coffee -b -o test/backbone_modelref/build -c test/backbone_modelref`
`cd #{PROJECT_ROOT}; coffee -b -o test/knockback_collection_observable/build -c test/knockback_collection_observable`
`cd #{PROJECT_ROOT}; coffee -b -o test/knockback_localized_observable/build -c test/knockback_localized_observable`
`cd #{PROJECT_ROOT}; coffee -b -o test/knockback_observable/build -c test/knockback_observable`
`cd #{PROJECT_ROOT}; coffee -b -o test/knockback_observables/build -c test/knockback_observables`
`cd #{PROJECT_ROOT}; coffee -b -o test/knockback_triggered_observable/build -c test/knockback_triggered_observable`
`cd #{PROJECT_ROOT}; coffee -b -o test/knockback_view_model/build -c test/knockback_view_model`
