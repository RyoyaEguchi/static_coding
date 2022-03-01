const gulp = require('gulp');
const sass = require('gulp-dart-sass');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const pug = require('gulp-pug');
const del = require('del');
const browserSync = require("browser-sync");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const webpackConfig = require("./webpack.config");

// 入出力するフォルダを指定
const srcBase = './src';
const publicBase = './public';

const srcPath = {
  'scss': srcBase + '/sass/pages/*.scss',
  'js': srcBase + '/js/pages/*.js',
  'pug': srcBase + '/pug/pages/**/*.pug',
  'img': srcBase + "/img/**/*.{jpg,jpeg,png,svg,gif}"
};

const publicPath = {
  'css': publicBase + '/assets/css/',
  'js': publicBase + '/assets/js/',
  'pug': publicBase + '/',
  'img': publicBase + "/assets/img"
};

// SCSSコンパイルするタスク
const compileSass = () => {
  return gulp.src(srcPath.scss)
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(autoprefixer({ cascade: true }))
    .pipe(gulp.dest(publicPath.css))
    .pipe(browserSync.stream())
}

// JSコンパイルするタスク
const compileJs = () => webpackStream(webpackConfig, webpack)
  .on("error", function (err) {
    console.log("!!!! js compile error !!!!", err);
  })
  .pipe(gulp.dest(publicPath.js))

// Pugコンパイルするタスク
const compilePug = () => {
  return gulp.src(srcPath.pug)
    .pipe(pug({
      pretty: true,
      basedir: srcBase + "/pug"
    }))
    .pipe(gulp.dest(publicPath.pug));
}

const compileImg = () => {
  return gulp.src(srcPath.img)
    .pipe(gulp.dest(publicPath.img));
}

// ローカルサーバ立ち上げ
const browserSyncFunc = () => {
  browserSync.init(browserSyncOption);
}

const browserSyncOption = {
  server: publicBase,
  open: false
}

// リロード
const browserSyncReload = (done) => {
  browserSync.reload();
  done();
}

// publicを空にするタスク
const publicClean = (done) => {
  del([publicBase + "/**", `!${publicBase}/.gitignore`]);
  done();
}

const watchFiles = () => {
  gulp.watch(srcBase + "/**/*.scss", gulp.series(compileSass, browserSyncReload))
  gulp.watch(srcBase + "/**/*.{jpg,jpeg,png,svg,gif}", gulp.series(compileImg, browserSyncReload))
  gulp.watch(srcBase + "/**/*.js", gulp.series(compileJs, browserSyncReload))
  gulp.watch(srcBase + "/**/*.pug", gulp.series(compilePug, browserSyncReload))
}


/**
 * seriesは「順番」に実行
 * parallelは並列で実行
 */
exports.default = gulp.series(
  gulp.parallel(compileSass, compileJs, compilePug, compileImg),
  gulp.parallel(watchFiles, browserSyncFunc)
);

exports.build = gulp.series(
  publicClean,
  gulp.parallel(compileSass, compileJs, compilePug, compileImg)
);

exports.clean = gulp.series(publicClean)