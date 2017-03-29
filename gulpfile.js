var gulp = require('gulp'),
  sass = require('gulp-sass'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  minify = require('gulp-minify-css'),
  cp = require('child_process'),
  browserSync = require('browser-sync'),
  messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
  },
 // reload = borwserSync.reload,
  assets = {
    'js': [
        "dist/js/*.js"
    ],
    'css': ["dist/scss/**/*.{scss,sass}"]
  };

// Prepares the JS file

gulp.task('js', function() {
  gulp.src(assets.js)
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('dist'));
});

// Prepares the CSS file
gulp.task('css', function() {
  gulp.src(assets.css)
    .pipe(sass({ includePaths: require('node-bourbon').includePaths }))
    .pipe(concat('main.css'))
    .pipe(minify({ keepBreaks: true }))
    .pipe(gulp.dest('_site/dist'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest(''));
});

gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn('bundle' , ['exec', 'jekyll', 'build', '--incremental'], {stdio: 'inherit'})
        .on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

gulp.task('browser-sync', ['css', 'js', 'watch', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

// watch

gulp.task('watch', function () {
    gulp.watch(assets.css, ['css']);
    gulp.watch(['*.html', '_includes/*.html'], ['jekyll-rebuild']);
});


gulp.task('default', ['browser-sync', 'watch']);


