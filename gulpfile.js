const gulp         = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS     = require('gulp-clean-css');
const include      = require('gulp-include');
const eslint       = require('gulp-eslint');
const isFixed      = require('gulp-eslint-if-fixed');
const babel        = require('gulp-babel');
const rename       = require('gulp-rename');
const sass         = require('gulp-sass')(require('sass'));
const sassLint     = require('gulp-sass-lint');
const uglify       = require('gulp-uglify');

const config = {
  src: {
    scssPath: './src/scss',
    jsPath: './src/js'
  },
  dist: {
    cssPath: './res/css',
    jsPath: './res/js'
  }
};

//
// Utility Functions
//

/**
 * Lints the SCSS
 * @param {string} src The SCSS source file/glob
 * @returns {Promise} Returns a gulp promise
 */
function lintSCSS(src) {
  return gulp.src(src)
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
}

/**
 * Compiles from SCSS to minified CSS.
 * @param {string} src The source file/glob
 * @param {string} dest The directory to write the output
 * @returns {Promise} Returns a gulp promise
 */
function buildCSS(src, dest) {
  dest = dest || config.dist.cssPath;

  return gulp.src(src)
    .pipe(sass({
      includePaths: [config.src.cssPath]
    }))
      .on('error', sass.logError)
    .pipe(cleanCSS())
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest(dest));
}

/**
 * Lints the javascript files
 * @param {string} src The source file/glob
 * @param {string} dest The destination directory
 * @returns {Promise} Returns a gulp promise
 */
function lintJS(src, dest) {
  dest = dest || config.src.jsPath;

  return gulp.src(src)
    .pipe(eslint({
      fix: true
    }))
    .pipe(eslint.format())
    .pipe(isFixed(dest));
}

/**
 * Minifies the specified javascript files
 * @param {string} src The source file/glob
 * @param {string} dest The destination directory
 * @returns {Promise} Returns a gulp promise
 */
function buildJS(src, dest) {
  dest = dest || config.dist.jsPath;

  return gulp.src(src)
    .pipe(include({
      includePaths: [config.packagesPath, config.src.jsPath]
    }))
    .on('error', console.log) // eslint-disable-line no-console
    .pipe(babel())
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest(dest));
}

//
// Gulp Tasks
//

gulp.task('scss-lint', () => {
  return lintSCSS(`${config.src.scssPath}/*.scss`);
});

gulp.task('scss-build-proj', () =>{
  return buildCSS(`${config.src.scssPath}/style.scss`);
});

gulp.task('css', gulp.series('scss-lint', 'scss-build-proj'));


gulp.task('es-lint', () => {
  return lintJS(
    [
      `${config.src.jsPath}/*.js`,
      `!${config.src.jsPath}/*.min.js`
    ]
  );
});

gulp.task('js-build-proj', () => {
  return buildJS(`${config.src.jsPath}/script.js`);
});

gulp.task('js', gulp.series('es-lint', 'js-build-proj'));


gulp.task('watch', () => {
  gulp.watch(`${config.src.scssPath}/**/*.scss`, gulp.series('css'));
  gulp.watch([`${config.src.jsPath}/**/*.js`, `!${config.src.jsPath}/**/*.min.js`], gulp.series('js'));
});

gulp.task('default', gulp.series('css', 'js'));
