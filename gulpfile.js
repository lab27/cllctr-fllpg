const child = require('child_process');
const browserSync = require('browser-sync').create();

const gulp = require('gulp');
const concat = require('gulp-concat');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const include = require("gulp-include");

const siteRoot = '_site';
const cssFiles = '_css/**/*.?(s)css';

gulp.task("scripts", function() {
  console.log("-- gulp is running task 'scripts'");
 
  gulp.src("js/app.js")
    .pipe(include())
      .on('error', console.log)
    .pipe(gulp.dest("_site/js"));

  // gulp.src("css/main.scss")
  //   .pipe(include())
  //     .on('error', console.log)
  //   .pipe(gulp.dest("_site/css"));
});

gulp.task('css', () => {
  gulp.src(cssFiles)
    .pipe(sass({includePaths: ['./_sass']}))
    .pipe(concat('wink.css'))
    .pipe(gulp.dest('css'));
});

gulp.task('jekyll', () => {
  const jekyll = child.spawn('jekyll', ['build',
    '--watch',
    '--incremental',
    '--drafts'
  ]);

  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };

  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('serve', () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });

  gulp.watch(cssFiles, ['css']);
});

gulp.task('default', ['css', 'scripts', 'jekyll', 'serve']);
