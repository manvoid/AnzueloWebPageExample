var gulp            = require('gulp'),
    // this is an arbitrary object that loads all gulp plugins in package.json. 
    $           = require("gulp-load-plugins")(),
    path        = require('path'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload,
    axis        = require('axis'),
    jeet        = require('jeet'),
    sass        = require('gulp-sass');

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "./dist"
    }
  });
});

gulp.task('compass', function() {
    return gulp.src('./src/stylesheets/*.scss')
        .pipe($.plumber())
        .pipe($.compass({
            css: 'dist/stylesheets',
            sass: 'src/stylesheets'
        }))
        .pipe(gulp.dest('dist/stylesheets'))
});

gulp.task('stylus', function() {
  return gulp.src('./src/stylesheets/main.styl')
        .pipe($.plumber())
        //.pipe($.accord('stylus', {}))
        .pipe($.stylus({
          compress: true,
          use: [axis(), jeet()]}))
        .pipe($.concat('out.css'))
        .pipe(gulp.dest('dist/stylesheets'));
});


gulp.task('js', function() {
  return gulp.src('src/scripts/*.js')
    .pipe($.plumber())
    .pipe( $.browserify({
      debug: true
    }))
    .pipe( $.uglify() )
    .pipe( $.rename('app.js'))
    .pipe( gulp.dest('dist/scripts/'));
});

gulp.task('images', function() {
  return gulp.src('./src/images/*')
    .pipe(gulp.dest('./dist/images'))
})

gulp.task('templates', function() {
  console.log('Entró en templates');
  return gulp.src('src/views/pages/**/*.jade')
    .pipe($.plumber())
    .pipe($.jade({
      pretty: true
    }))
    .pipe( gulp.dest('dist/') )
});

gulp.task('default',['stylus','js','templates','browser-sync'], function () {
  
  gulp.watch('src/stylesheets/*.scss',['compass', reload]);

  gulp.watch('src/stylesheets/*.styl',['stylus', reload]);

  gulp.watch('src/views/**/*.styl',['stylus', reload]);

  gulp.watch('src/scripts/*.js',['js', reload]);

  gulp.watch('src/views/**/*.jade',['templates', reload]);
    
});


