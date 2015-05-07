var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    livereload  = require('gulp-livereload'),
    cssmin      = require('gulp-cssmin'),
    webserver   = require('gulp-webserver'),
    sass        = require('gulp-sass'),
    opn         = require('opn');

var DOMAIN = '192.168.2.17',
    PORT = 8888;

var paths = {
    js: 'www/js/*.js',
    css: 'www/css/*.css',
    sass: 'www/scss/*.scss'
};

gulp.task('scripts', function() {
    gulp.src(paths.js)
        .pipe(uglify())
        .pipe(concat('script.min.js'))
        .pipe(gulp.dest('./www/dist/'))
        .pipe(livereload());
});

gulp.task('sass', function () {
  gulp.src(paths.sass)
    .pipe(sass({
        errLogToConsole: true,
        sourceComments : 'normal'
    }))
    .pipe(gulp.dest('./www/css/'));
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
    gulp.watch(paths.sass, function() {
        gulp.run('sass');
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

gulp.task('default', ['webserver', 'watch', 'scripts', 'openbrowser']);