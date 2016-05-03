# gulp项目脚手架

## use
* npm install 安装所需要的依赖，至于nodeJS自行脑补。
* npm start 运行项目，具体配置看json文件。

## 功能
* 本地浏览器实时调试，再也不用F5。
* js,css实现 合并，压缩
* 静态页面压缩，图片压缩
* SASS同步编译并压缩
* font-spider字体压缩神器

## gulp基本API
* gulp.src(globs[, options])
* gulp.dest(path[, options])
* gulp.task(name[, deps], fn)
* gulp.watch(glob [, opts], tasks)

#### gulp.src(globs[, options])
输出（Emits）符合所提供的匹配模式（glob）或者匹配模式的数组（array of globs）的文件。 将返回一个 Vinyl files 的 stream 它可以被 piped 到别的插件中。

#### gulp.dest(path[, options])
能被 pipe 进来，并且将会写文件。并且重新输出（emits）所有数据，因此你可以将它 pipe 到多个文件夹。如果某文件夹不存在，将会自动创建它。

#### gulp.task(name[, deps], fn),gulp.watch(glob [, opts], tasks) 或 gulp.watch(glob [, opts, cb])
监视文件，并且可以在文件发生改动时候做一些事情。它总会返回一个 EventEmitter 来发射（emit） change 事件。

#### 相关链接
* [gulp官网](http://www.gulpjs.com.cn/) 
* [Glup 简明使用教程](http://www.jianshu.com/p/3f2e13442555)

## 配置
* gulp 基础库
* gulp-imagemin 图片压缩
* gulp-ruby-sass sass
* gulp-minify-css css压缩
* gulp-jshint' js检查
* gulp-uglify js压缩
* gulp-rename 重命名
* gulp-concat 合并文件
* gulp-clean 清空文件夹
* gulp-webserver 本地服务器
* gulp-notify 改动通知
* gulp-autoprefixer') 给css样式自动添加浏览器前缀
* gulp-cache 图片快取，只有更改过得图片会进行压缩
* gulp-livereload 即时重整
* font-spider 字体压缩
