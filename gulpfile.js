var gulp       = require('gulp');
var watchify   = require('watchify');
var gutil      = require('gulp-util');
var uglify     = require('gulp-uglify');
var concat     = require('gulp-concat');
var clean      = require('gulp-clean');
var react      = require('gulp-react');
var uglify     = require('gulp-uglify');
var rename     = require('gulp-rename');
var nodemon    = require('gulp-nodemon');
var browserify = require('gulp-browserify');
var reactify   = require('reactify')

//Parse and compress JS and JSX files
//TODO -- Add Watchify

gulp.task('react-jsx -> js', function() {
  return gulp.src('frontend/js/**/*.jsx')
    .pipe(react())
    //.pipe(uglify())
    .pipe(rename(function (path) {
        path.extname = ".min.js";
    }))
    .pipe(gulp.dest('build/js/components'))
});

gulp.task('javascript', function() {
  // Listen to every JS file in ./frontend/javascript
  return gulp.src('frontend/js/**/*.js')
    .pipe(rename(function (path) {
        path.extname = ".min.js";
    }))
    .pipe(gulp.dest('build/js/lib'))
});

gulp.task('browserify', ['javascript', 'react-jsx -> js'], function() {
   return gulp.src('build/js/components/*', {read: false})
    .pipe(browserify({
      transform: ['envify'],
      debug: true,
      extensions: [".jsx"]
    }))
    //.pipe(uglify()) //.pipe(rename('compiled.js'))
    .pipe(gulp.dest('build/js/components'))
});

gulp.task('parse-browserify', ['javascript', 'react-jsx -> js'], function() {
  return gulp.src(['build/js/components/*'], {read: false})
    .pipe(browserify({
      transform: ['envify'],
      debug: true,
      extensions: [".jsx"]
    }))
    //.pipe(concat('compiled.js'))
    //.pipe(uglify())
    .pipe(gulp.dest('../prospecter-parse-prod/public/js'))
});

gulp.task('parse-libs', function() {
  return gulp.src('build/js/lib/*')
    .pipe(gulp.dest('../prospecter-parse-prod/public/js'))
})

gulp.task('styles', function() {
  return gulp.src('frontend/**/*.css')
    .pipe(gulp.dest('build/'));
});

gulp.task('parse-styles', function() {
  return gulp.src('frontend/**/*.css')
    .pipe(concat('compiled.css'))
    //.pipe(uglify())
    .pipe(gulp.dest('../prospecter-parse-prod/public/css'));
});

gulp.task('images', function() {
  return gulp.src('frontend/img/*')
    .pipe(gulp.dest('build/img'));
});

gulp.task('parse-images', function() {
  return gulp.src('frontend/img/*')
    .pipe(gulp.dest('../prospecter-parse-prod/public/img'));
});

gulp.task('clean', function() {
  return gulp.src(['build/*'], {read: false}).pipe(clean());
});

gulp.task('parse-clean', function() {
  folders = gulp.src(['../prospecter-parse-prod/public/css/*',
    '../prospecter-parse-prod/public/js/*',
    '../prospecter-parse-prod/public/img/*', ], {read: false})
  folders.pipe(clean({force: true}))
});

gulp.task('watch', ['clean'], function() {
  gulp.run('default')

  gulp.watch('frontend/**/*', function() {
    gulp.run('javascript');
    gulp.run('react-jsx -> js');
    gulp.run('styles');
    gulp.run('images');
    gulp.run('browserify');
  });
});

gulp.task('default', ['clean'], function() {
  return gulp.start('browserify', 'styles', 'images');
});

/* Gulp Parse Production */
gulp.task('parse', ['parse-clean'], function() {
  // Parse Styles // Parse images // Parse Browserify
  // Add A clean to parse public
  return gulp.start('parse-browserify', 'parse-libs', 
                    'parse-styles', 'parse-images')
  //return gulp.start('parse-browserify')
})

