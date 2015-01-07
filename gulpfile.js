var gulp = require('gulp');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var less = require('gulp-less');

gulp.task('browserify', function() {
  var browserified = transform(function(filename) {
    return browserify(filename).bundle();
  });

  return gulp.src(["./client/**/*.js"])
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(concat('game.js'))
    .pipe(browserified)
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./static'));
});

gulp.task('less', function() {
  return gulp.src('./client/**/*.less')
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(less())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./static'));
});
