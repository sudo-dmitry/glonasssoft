const gulp = require('gulp');
const sass = require('gulp-sass')(require('node-sass'));
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const gulpif = require('gulp-if');

var isProd = false;


gulp.task('sass', function() {
    return gulp.src('src/scss/style.scss')
        .pipe(plumber())
        .pipe(gulpif(!isProd, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({browserlist: ['last 10 versions', 'opera 12', '> 1%', 'ie 8']}))
        .pipe(cleanCss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulpif(!isProd, sourcemaps.write('.')))
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('js', function() {
    return gulp.src('src/js/app.js')
        .pipe(plumber())
        .pipe(gulpif(!isProd, sourcemaps.init()))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulpif(!isProd, sourcemaps.write('.')))
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('watch', function() {
    gulp.watch('src/scss/**/*.scss', gulp.series('sass'));
    gulp.watch('src/js/**/*.js', gulp.series('js'));
});

const toProd = (done) => {
    isProd = true;
    done();
};

gulp.task('build', gulp.series(toProd, 'sass', 'js'));