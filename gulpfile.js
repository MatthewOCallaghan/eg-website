const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const useref = require('gulp-useref');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const gulpIf = require('gulp-if');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const imagemin= require('gulp-imagemin');
const cache = require('gulp-cache');
const del = require('del');

function setupBrowserSync(cb) {
    browserSync.init({
        server: {
            baseDir: 'src'
        }
    });
    cb();
}

function processSass() {
    return src('src/scss/**/*.scss')
            .pipe(sass())
            .pipe(dest('src/css'))
            .pipe(browserSync.reload({
                stream: true
            }));
}

function reload(cb) {
    browserSync.reload();
    cb();
}

function watchFiles() {
    watch('src/scss/**/*.scss', processSass);
    watch('src/**/*.html', reload);
    watch('src/js/**/*.js', reload);
}

function buildFiles() {
    const postcssPlugins = [autoprefixer(), cssnano()];
    return src('src/**/*.html')
            .pipe(useref())
            .pipe(gulpIf('*.js', babel({ presets: ['@babel/env']})))
            .pipe(gulpIf('*.js', uglify()))
            .pipe(gulpIf('*.css', postcss(postcssPlugins)))
            .pipe(dest('dist'));
}

function minifyImages() {
    return src('src/images/**/*.+(png|jpg|gif|svg)')
            .pipe(cache(imagemin({ interlaced: true })))
            .pipe(dest('dist/images'));
}

function cleanDist() {
    return del('dist');
}

function clearCache(cb) {
    return cache.clearAll(cb);
}

exports.watch = watchFiles;

exports.buildFiles = buildFiles;

exports.minifyImages = minifyImages;

exports.cleanDist = cleanDist;

exports.clearCache = clearCache;

exports.default = series(setupBrowserSync, processSass, watchFiles);

exports.build = series(cleanDist, processSass, parallel(buildFiles, minifyImages));