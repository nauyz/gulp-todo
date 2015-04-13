var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    livereload  = require('gulp-livereload'),
    cssmin      = require('gulp-cssmin'),
    webserver   = require('gulp-webserver');
    opn         = require('opn');

var DOMAIN = 'localhost',
    PORT = 8888;

var paths = {
    js: 'www/js/*.js',
    css: 'www/css/*.css',
};

gulp.task('scripts', function() {
    gulp.src(paths.js)
        .pipe(uglify())
        .pipe(concat('script.min.js'))
        .pipe(gulp.dest('./www/dist/'))
        .pipe(livereload());
});

gulp.task('styles', function () {
    gulp.src(paths.css)
        .pipe(cssmin())
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('./www/dist/'))
        .pipe(livereload());
});

gulp.task('watch', function(){
    gulp.watch(paths.js, function() {
        gulp.run('scripts');
    });
    gulp.watch(paths.css, function() {
        gulp.run('styles');
    });
});

gulp.task('openbrowser', function() {
  opn('http://'+ DOMAIN + ':' + PORT);
});

gulp.task('webserver', function() {
  gulp.src('./www/')
    .pipe(webserver({
      host:             DOMAIN,
      port:             PORT,
      livereload:       true,
      fallback:         'index.html'
    }));
});

gulp.task('default', ['webserver', 'watch', 'scripts', 'styles', 'openbrowser']);