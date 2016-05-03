// 引入 gulp及组件
var gulp    = require('gulp'),                 //基础库
    imagemin = require('gulp-imagemin'),       //图片压缩
    sass = require('gulp-ruby-sass'),          //sass
    minifycss = require('gulp-minify-css'),    //css压缩
    jshint = require('gulp-jshint'),           //js检查
    uglify  = require('gulp-uglify'),          //js压缩
    rename = require('gulp-rename'),           //重命名
    concat  = require('gulp-concat'),          //合并文件
    clean = require('gulp-clean'),             //清空文件夹
    webserver = require('gulp-webserver'),     // 本地服务器
    notify = require('gulp-notify'),           //改动通知
    autoprefixer = require('gulp-autoprefixer'), //给css样式自动添加浏览器前缀
    cache = require('gulp-cache'),             //图片快取，只有更改过得图片会进行压缩
    livereload = require('gulp-livereload');   //即时重整

// HTML处理
gulp.task('html', function() {
    var htmlSrc = './src/*.html',
        htmlDst = './dist/';

    return gulp.src(htmlSrc)
        .pipe(gulp.dest(htmlDst))
        .pipe(notify({ message: 'html task complete' }));
});

// 样式处理
gulp.task('css', function () {
    var cssSrc = './src/css/*.css',
        cssDst = './dist/css';

    return gulp.src(cssSrc)
        //.pipe(sass({ style: 'expanded'})) SASS
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(concat('main.css'))
        .pipe(gulp.dest(cssDst))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest(cssDst))
        .pipe(livereload())
        .pipe(notify({ message: 'Styles task complete' }));
});

// 图片处理
gulp.task('images', function(){
    var imgSrc = './src/images/*',
        imgDst = './dist/images';
    return gulp.src(imgSrc)
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest(imgDst))
        .pipe(notify({ message: 'Images task complete' }));
});

// js处理
gulp.task('js', function () {
    var mainSrc = './src/js/*.js',
        mainDst = './dist/js';

    return gulp.src(mainSrc)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(mainDst))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest(mainDst))
        .pipe(livereload())
        .pipe(notify({ message: 'Scripts task complete' }));
});

// 清空图片、样式、js
gulp.task('clean', function() {
    return gulp.src(['./dist/css/*', './dist/js/*', './dist/images/*'], {read: false})
        .pipe(clean());
});

// 默认任务 清空图片、样式、js并重建 运行语句 gulp
gulp.task('default', ['clean','webserver','watch'], function(){
    gulp.start('html','css','images','js');
});

// 监听任务 运行语句 gulp watch
gulp.task('watch',function(){
    // 监听html文件
    gulp.watch('src/*.html', ['html']);
    // 监听css文件
    gulp.watch('src/css/*.css', ['css']);
    // 监听js文件
    gulp.watch('src/js/*.js', ['js']);
    // 监听图片文件
    gulp.watch('src/images/*', ['images']);
    // 建立即时重整伺服器
    livereload.listen();
    // 监听所有位在 dist/  目录下的文件，一旦有更动，便进行重整
    gulp.watch(['dist/**']).on('change',livereload.changed);
});

//启动服务器
gulp.task('webserver', function() {
    gulp.src( './dist/' )
        .pipe(webserver({
            livereload: true,
            open: true
        }));
});
