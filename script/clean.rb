# Run me with: 'ruby script/clean.rb'
require 'rubygems'
require 'fileutils'
require 'yaml'

PROJECT_ROOT = File.expand_path('../..', __FILE__)
CLEAN_PATTERNS = [
  '**.js',
  'build/**.js',

  'examples_lib/build/**.js',
]

# add tests
config = YAML::load( File.open( 'config/config.yaml' ) )
if config && config['test_dirs']
  config['test_dirs'].each{|path| CLEAN_PATTERNS.push(path+'/build/**.js')}
end

CLEAN_PATTERNS.each do |pattern|
  full_dir = "#{PROJECT_ROOT}/pattern"
  dir = File.dirname(pattern)

  next unless (dir && File.exists?(dir))
  file_pattern = File.basename(pattern)
  Dir.entries(dir).each do |filename|
    next unless (filename != ".") && (filename != "..")
    pathed_file = "#{dir}/#{filename}"
    next unless (!File.directory?(pathed_file) && File.fnmatch?(file_pattern, filename))
    File.delete(pathed_file)
  end
end
