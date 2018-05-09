var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');

gulp.task('default', ['scripts', 'css'], function() {

});

gulp.task('scripts', function() {
    return browserify('./scripts/main.js')
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('bundle.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest('./build/'));
});

gulp.task('css', function(){
    return gulp.src('css/*.css')
        .pipe(cleanCSS())
        //.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('./build/'))
});

gulp.task('watch', function() {
    gulp.watch('scripts/*.scripts', ['default']);
    gulp.watch('stylesheets/*.css', ['default']);
});