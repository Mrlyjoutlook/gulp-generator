// 引入 gulp及组件
var path = require('path'),
    fs = require('fs'),
    gulp = require('gulp'),                 //基础库

    imagemin = require('gulp-imagemin'),       //图片压缩
    pngquant = require('imagemin-pngquant');   //图片压缩png加强插件

    minifycss = require('gulp-minify-css'),    //css压缩
    postcss = require('gulp-postcss'),         //添加PostCSS插件进行css处理
    autoprefixer = require('autoprefixer'),    //处理css兼容浏览器
    px2rem = require('postcss-px2rem'),        //用于淘宝px转化rem
    cssBase64 = require('gulp-css-base64'),

    jshint = require('gulp-jshint'),           //js检查
    uglify  = require('gulp-uglify'),          //js压缩

    rev = require('gulp-rev'),                 //文件名加MD5后缀
    revCollector = require('gulp-rev-collector'),  //路径替换
    rename = require('gulp-rename'),           //重命名
    concat  = require('gulp-concat'),          //合并文件
    // tap = require('gulp-tap'),                 //改变文件的内容
    browserSync = require('browser-sync'),     //服务器
    yargs = require('yargs').options({    //用于获取启动参数，针对不同参数，切换任务执行过程时需要
        'w': {
            alias: 'watch',
            type: 'boolean'
        },
        's': {
            alias: 'server',
            type: 'boolean'
        },
        'p': {
            alias: 'port',
            type: 'number'
        }
    }).argv;

var pathName={
    htmlSrc:'./src/*.html',
    htmlDst:'./dist/',
    stylesSrc:'./src/styles/*.css',
    stylesDst:'./dist/assets',
    imgSrc:'./src/images/*',
    imgDst:'./dist/assets',
    libSrc:'./src/lib/*.min.js',
    libDst:'./dist/assets',
    jsSrc:'./src/js/*.js',
    jsDst:'./dist/assets'
};

var distPathName={
    jsSrc:['./dist/assets/*.js','!./dist/assets/*.min.js'],
    jsDst:'./dist/assets',
    stylesSrc:['./dist/assets/*.css','!./dist/assets/*.min.css'],
    stylesDst:'./dist/assets'
}

/*************************** dev env *************************************/

// release HTML处理
gulp.task('build:html', function() {
    return gulp.src(pathName.htmlSrc)
        // .pipe(tap(function (file){
        //     var dir = path.dirname(file.path);
        //     var contents = file.contents.toString();
        //     contents = contents.replace(/<link\s+rel="import"\s+href="(.*)">/gi, function (match, $1){
        //         var filename = path.join(dir, $1);
        //         var id = path.basename(filename, '.html');
        //         var content = fs.readFileSync(filename, 'utf-8');
        //         return '<script type="text/html" id="tpl_'+ id +'">\n'+ content +'\n</script>';
        //     });
        //     file.contents = new Buffer(contents);
        // }))
        .pipe(gulp.dest(pathName.htmlDst))
        .pipe(browserSync.reload({stream: true}));
});

// release styles
gulp.task('build:styles', function () {
     var postCssConf=[
         px2rem({remUnit: 75}),
         autoprefixer('iOS >= 7', 'Android >= 4.1')
     ];

    return gulp.src(pathName.stylesSrc)
        .pipe(postcss(postCssConf))
        // .pipe(concat('main.css'))
        .pipe(gulp.dest(pathName.stylesDst))
        .pipe(browserSync.reload({stream: true}));
});

// release lib处理
gulp.task('build:lib', function () {
    return gulp.src(pathName.libSrc)
        .pipe(gulp.dest(pathName.libDst))
        .pipe(browserSync.reload({stream: true}));
});

// release js处理
gulp.task('build:js', function () {
    return gulp.src(pathName.jsSrc)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        // .pipe(concat('main.js'))
        .pipe(gulp.dest(pathName.jsDst))
        .pipe(browserSync.reload({stream: true}));
});

// release 图片处理
gulp.task('build:images', function(){
    return gulp.src(pathName.imgSrc)
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true,
            use: [pngquant({quality: '65-80'})]
        }))
        .pipe(gulp.dest(pathName.imgDst))
        .pipe(browserSync.reload({stream: true}));
});
/*************************** dist env *************************************/

// rev md5
gulp.task('dist:rev', function() {
    gulp.src(['./rev/*.json', './dist/*.html'])   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector())                                   //- 执行文件内css名的替换
        .pipe(gulp.dest('./dist/'));                     //- 替换后的文件输出的目录
});

// dist js styles + md5
gulp.task('dist:md5',function(){
    return gulp.src(distPathName.jsSrc.concat(distPathName.stylesSrc))
        .pipe(rev())
        .pipe(gulp.dest('./dist/assets'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev'));
})

// dist js
gulp.task('dist:js',function(){
    return gulp.src(distPathName.jsSrc)
        // .pipe(rename({ suffix: '.dist' }))
        .pipe(uglify())
        .pipe(gulp.dest(distPathName.jsDst));
})

// dist styles
gulp.task('dist:styles',function(){
    return gulp.src(distPathName.stylesSrc)
        .pipe(cssBase64())
        // .pipe(rename({ suffix: '.dist' }))
        .pipe(minifycss())
        .pipe(gulp.dest(distPathName.stylesDst));
})

/*************************** develop command *************************************/

// 对js进行压缩打包+md5处理
gulp.task('dist',['dist:js','dist:styles','dist:md5','dist:rev']);

// build project
gulp.task('release', ['build:js','build:lib','build:images','build:styles','build:html']);

// 监听任务
gulp.task('watch', ['release'], function () {
    gulp.watch('src/styles/*', ['build:styles']);
    gulp.watch('src/images/*.?(png|jpg|gif)', ['build:images']);
    gulp.watch('src/js/*.js',['build:js']);
    gulp.watch('src/lib/*.js',['build:lib']);
    gulp.watch('src/**/*.html', ['build:html']);
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