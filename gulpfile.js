const gulp = require('gulp');
const clean = require('gulp-clean');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const runSequence = require('run-sequence');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');

gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

gulp.task('babelify', () => {
  return browserify('src/index.js')
    .transform(babelify, {presets: ['es2015']})
    .bundle()
    .pipe(source('orchester.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('uglify:js', () => {
  return gulp.src('dist/*.js')
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('dist'))
});

gulp.task('build', () => {
  return runSequence('clean', 'babelify', 'uglify:js')
});
