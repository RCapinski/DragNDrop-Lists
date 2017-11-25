var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('gulp-browserify');

gulp.task('styles', function() {
    gulp.src('scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css/'))
});
gulp.task('browser', function() {
    gulp.src('./app.js')
    .pipe(browserify({
    insertGlobals : true,
    debug : !gulp.env.production
    }))
    .pipe(gulp.dest('./js/'))
});


//Watch task
gulp.task('default',function() {
    gulp.watch('scss/**/*.scss',['styles']);
    gulp.watch('./app.js',['browser']);
});