var gulp = require('gulp'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    prefix = require('gulp-autoprefixer'),
    ghPages = require('gulp-gh-pages'),
    browserSync = require('browser-sync').create();

'use strict';

function errorLog(error) {
  console.error.bind(error);
  this.emit('end');
}

// Static server - reloads after changes to html, css, or js
gulp.task('serve', ['sass'], function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('assets/js/*.js', ['scripts']);
    gulp.watch('scss/**/*.scss', ['sass']);
    gulp.watch('./*.html').on('change', browserSync.reload);
});

//Push directly to gh-pages
gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

//watch for changes in js and minifies files
gulp.task('scripts', function() {
    gulp.src('assets/js/*.js')
      .pipe(uglify())
      .on('error', errorLog)
      .pipe(gulp.dest('assets/minjs/'));
})

//checks for errors, automatically adds prefixers to css
gulp.task('sass', function () {
    gulp.src('scss/**/*.scss')
      .pipe(sass.sync().on('error', sass.logError))
      .pipe(prefix('last 2 versions'))
      .pipe(gulp.dest('assets/css/'))
      .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);
