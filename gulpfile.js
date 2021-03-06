const 
    /* основные плагины */
    gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    prefixer = require('gulp-autoprefixer'),
    del = require('del'),
    /* Плагины для сжатия и конкатинации */
    include = require('gulp-file-include'),
    jsmin = require('gulp-uglify-es'),
    cleanCss = require('gulp-clean-css'),
    /* Оптимизация */
    media = require('gulp-group-css-media-queries');

/* выбор препроцессора */    
const preproc = sass;

/* основные пути к файлам */
const path = {
    /* пути для папок с готовыми файлами */
    build: {
        html: './build/',
        js: './build/js/',
        css: './build/css/',
        images: './build/images/',
        font: './build/fonts/',
    },
    /* пути для папок с исходными файлами */
    src: {
        html: ['./src/**/*.html','!./src/html_partial'],
        htmlInclude: './src/html_partial',
        style: './src/style/*.+(less|sass|scss|css)',
        js: './src/js/**/*.js',
        css: './src/css/',
        images: './src/images/**/*.*',
        font: './src/fonts/**/*.*',
    },
    /* просмотр файлов */
    watch: {
        html: './src/**/*.html',
        style: './src/style/**/*.*',
        js: './src/js/**/*.js',
        images: './src/images/**/*.*',
        font: './src/fonts/**/*.*',
    },
    /* очистка сборки */
    clean: {
        src: './build/**/*.*',
    },
};


/* конфигурация локального сервера */
const config = {
    server:{
        baseDir: './build/'
    },
    tunnel: false,
    nitify: false,
    host: 'localhost',
    port: 9000,
    browser: "chrome",
};

/* сборка HTML  */
const htmlBuild = () => {
    return gulp
    .src(path.src.html)
    .pipe(plumber())
    .pipe(include({
        prefix: '@@',
        basepath: path.src.htmlInclude
    }))
    // .pipe(htmlmin())
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({
        stream: true
    }));
};
exports.htmlBuild = gulp.series(htmlBuild); 
/* сборка HTML end */

/* сборка StyleCss */
const styleBuild = () => {
    return gulp
    .src(path.src.style)
    .pipe(plumber())
    .pipe(preproc())
    .pipe(media())
    .pipe(gulp.dest(path.src.css))
    .pipe(prefixer({
        browsers: ['last 10 versions', '> 3%', 'ie 11']
    }))
    // .pipe(cleanCss())
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({
        stream: true
    }));
};
exports.styleBuild = gulp.series(styleBuild);
/* сборка StyleCss end */

/* сборка jsBuild */
const jsBuild = () => {
    return gulp 
    .src(path.src.js)
    .pipe(plumber())
    // .pipe(jsmin())
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({
        stream: true
    }));
}
exports.jsBuild = gulp.series(jsBuild);
/* сборка jsBuild  end*/

/* imagesBuild */
const imagesBuild = () => {
    return gulp
    .src(path.src.images)
    .pipe(gulp.dest(path.build.images))
    .pipe(reload({
        stream: true
    }));
};
exports.imagesBuild = gulp.series(imagesBuild);
/* imagesBuild end */

/* fontsBuild  */
const fontsBuild = () => {
    return gulp
    .src(path.src.font)
    .pipe(gulp.dest(path.build.font))
    .pipe(reload({
        stream: true
    }));
}
exports.fontsBuild = gulp.series(fontsBuild);
/* fontsBuild end */

/* удаление */
const deleteBuild = () => {
    return del(path.clean.src);
}
exports.deleteBuild = gulp.series(deleteBuild);
/* удаление end */

/* watcher */
const watcher = () => {
    gulp.watch(path.watch.html, htmlBuild);
    gulp.watch(path.watch.style, styleBuild);
    gulp.watch(path.watch.js, jsBuild);
    gulp.watch(path.watch.images, imagesBuild);
    gulp.watch(path.watch.font, fontsBuild);
};
exports.watcher = gulp.series(watcher);
/* watcher end */

/* server */
const server = () => {
    return browserSync(config);
}
exports.server = gulp.series(server);
/* server end */

/* конечная сборка билда */
exports.build = gulp.series(
    deleteBuild,
    gulp.parallel(htmlBuild, styleBuild, jsBuild, imagesBuild, fontsBuild)
);

exports.default = gulp.series(exports.build, gulp.parallel(server, watcher));
