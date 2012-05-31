# Run me with: 'ruby script/watch.rb'
require 'rubygems'
require 'directory_watcher'
require 'rev'
require 'fileutils'

PROJECT_ROOT = File.expand_path('../..', __FILE__)
SRC_DIRS = [
  'src/**/*.coffee',
  'test/_examples/**/*.coffee',
]

# add tests
config = YAML::load( File.open( 'config.yaml' ) )
if config && config['test_dirs']
  config['test_dirs'].each{|path| SRC_DIRS.push(path+'/**/*.coffee')}
end

in_build = false
change_file = nil

dw = DirectoryWatcher.new(PROJECT_ROOT, :glob => SRC_DIRS, :scanner => :rev, :interval => 2.0, :pre_load => true)
dw.add_observer {|*args| args.each do |event|
  # mark as needing a build if already building - used to filter multiple file changes during a build cycle
  change_file = File.basename(event.path)
  return if in_build

  in_build = true
  while change_file
    puts "#{change_file} changed. Rebuilding"
    change_file = nil
    `cd #{PROJECT_ROOT}; ruby script/build.rb`
  end
  in_build = false
  puts "Rebuilding finished. Now watching..."
end}

# build now
puts "Build started"
`cd #{PROJECT_ROOT}; ruby script/build.rb`
puts "Build finished. Now watching..."

# start watching
dw.start
   gets      # when the user hits "enter" the script will terminate
dw.stop