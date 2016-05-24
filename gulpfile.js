// 引入 gulp及组件
var path = require('path'),
    fs = require('fs'),
    gulp    = require('gulp'),                 //基础库
    imagemin = require('gulp-imagemin'),       //图片压缩
    minifycss = require('gulp-minify-css'),    //css压缩
    jshint = require('gulp-jshint'),           //js检查
    uglify  = require('gulp-uglify'),          //js压缩
    rename = require('gulp-rename'),           //重命名
    concat  = require('gulp-concat'),          //合并文件
    tap = require('gulp-tap'),                 //改变文件的内容
    yargs = require('yargs').argv,             //用于获取启动参数，针对不同参数，切换任务执行过程时需要
    postcss = require('gulp-postcss'),         //添加PostCSS插件进行css处理
    browserSync = require('browser-sync'),     //服务器
    autoprefixer = require('autoprefixer'),    //处理css兼容浏览器
    px2rem = require('postcss-px2rem'),        //用于淘宝px转化rem
    pngquant = require('imagemin-pngquant');   //图片压缩png加强插件

// HTML处理
gulp.task('build:html', function() {
    var htmlSrc = './src/*.html',
        htmlDst = './dist/';

    return gulp.src(htmlSrc)
        .pipe(tap(function (file){
            var dir = path.dirname(file.path);
            var contents = file.contents.toString();
            contents = contents.replace(/<link\s+rel="import"\s+href="(.*)">/gi, function (match, $1){
                var filename = path.join(dir, $1);
                var id = path.basename(filename, '.html');
                var content = fs.readFileSync(filename, 'utf-8');
                return '<script type="text/html" id="tpl_'+ id +'">\n'+ content +'\n</script>';
            });
            file.contents = new Buffer(contents);
        }))
        .pipe(gulp.dest(htmlDst))
        .pipe(browserSync.reload({stream: true}));
});

// 样式处理
gulp.task('build:style', function () {
    var cssSrc = './src/style/*.css',
        cssDst = './dist/style';
     var postCssConf=[
         px2rem({remUnit: 75}),
         autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4')
     ];

    return gulp.src(cssSrc)
        .pipe(postcss(postCssConf))
        .pipe(concat('main.css'))
        .pipe(gulp.dest(cssDst))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest(cssDst))
        .pipe(browserSync.reload({stream: true}));
});

// 图片处理
gulp.task('build:images', function(){
    var imgSrc = './src/images/*',
        imgDst = './dist/images';

    return gulp.src(imgSrc)
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true,
            use: [pngquant({quality: '65-80'})]
        }))
        .pipe(gulp.dest(imgDst))
        .pipe(browserSync.reload({stream: true}));
});

// minJs处理
gulp.task('build:minJs', function () {
    var minJsSrc = './src/minJs/*.min.js',
        minJsDst = './dist/js';

    return gulp.src(minJsSrc)
        .pipe(gulp.dest(minJsDst))
        .pipe(browserSync.reload({stream: true}));
});

// js处理
gulp.task('build:js', function () {
    var jsSrc = './src/js/*.js',
        jsDst = './dist/js';

    return gulp.src(jsSrc)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(jsDst))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest(jsDst))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('release', ['build:js','build:minJs','build:images','build:style','build:html']);

// 监听任务
gulp.task('watch', ['release'], function () {
    gulp.watch('src/style/*', ['build:style']);
    gulp.watch('src/images/*.?(png|jpg|gif)', ['build:images']);
    gulp.watch('src/js/*.js',['build:js']);
    gulp.watch('src/minJs/*.js',['build:minJs']);
    gulp.watch('src/*.html', ['build:html']);
});

// 调试服务器
gulp.task('server', function () {
    yargs.p = yargs.p || 8080;
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        ui: {
            port: yargs.p + 1,
            weinre: {
                port: yargs.p + 2
            }
        },
        port: yargs.p,
        startPath: '/',
        online: true
    });
});

// 参数说明
//  -w: 实时监听
//  -s: 启动服务器
//  -p: 服务器启动端口，默认8080
gulp.task('default', ['release'], function () {
    if (yargs.s) {
        gulp.start('server');
    }

    if (yargs.w) {
        gulp.start('watch');
    }
});