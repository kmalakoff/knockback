module.exports = (callback) ->
  return callback()
  # return gulp.src(library.paths)
  #   .pipe(es.map (file, callback) -> file.path = file.path.replace("#{path.resolve(dir)}/", '') for dir in root_paths; callback(null, file))
  #   .pipe(compile({coffee: {bare: true, header: false}}))
  #   .pipe(modules(library.modules))
  #   .pipe(es.map((file, callback) -> console.log "Compiled #{library.modules.file_name}"; callback(null, file)))
