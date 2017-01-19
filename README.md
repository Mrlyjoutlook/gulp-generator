# gulp项目脚手架
### 此此项目的脚手架偏用于移动端web app的开发 

## use
* npm install 安装所需要的依赖，至于nodeJS自行脑补。
* npm start 运行项目，具体配置看json文件。

## 项目目录结构
``````
|-dist
|---assets
|---index.html
|-node_modeules
|-src
|---fragment     --组件html
|---images       
|---js
|---lib        --引用的js,如jQ,误放入js里面
|---style
|---index.html
|-.jshintrc
|-gulpfile.js
|-package.json
``````

## 介绍
* 本地浏览器实时调试，再也不用F5。
* js,css实现 合并，压缩
* 静态页面压缩，图片压缩
* font-spider字体压缩神器
* 引入了前端轻量级的router功能,使用参考本项目的demo,以及 [链接](https://github.com/progrape/router)
* jQuery目前版本为1.8.3,可自行更换
* 前端适配方案采用手淘方案 [链接](https://github.com/amfe/article/issues/17)
* 对于px转换rem,采用postcss处理,请参照本项目的demo

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

#### 如果遇到什么不懂,需要帮助可以lssues me,欢迎!
