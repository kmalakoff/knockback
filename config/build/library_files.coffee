path = require 'path'

LIBRARIES = require './libraries'

module.exports = ALL_LIBRARY_FILES = (path.join(library.destination, library.modules.file_name) for library in LIBRARIES)
ALL_LIBRARY_FILES.push path.join(library.destination, library.stack_file_name) for library in LIBRARIES when library.stack_file_name
ALL_LIBRARY_FILES.push library.replace('.js', '.min.js') for library in ALL_LIBRARY_FILES
