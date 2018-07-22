Parcel 有着开箱即用的特性, 为我们初始化工程省却了许多时间, 但是零配置的特性导致我们比较不方便进行一些预处理, 这篇文章就带领读者解决一些我们常会遇到的一些问题. 只需要很简单的添加几个参数,就可以满足我们大部分的特殊情况.

在去年, Parcel 没有支持 SourceMap 的特性, 导致于无法进行断点调试, 从而很多团队没有在生产中使用 Parcel, 现在 Parcel 已经支持 SourceMap 的特性, 再加上可以很方便的编写插件去填补一些自定义的功能, 所以 Parcel 我认为已经可以在新项目的生产中投入使用了.

本文作者简单的编写了一个 `parcel-plugin-change-file` 插件示例, 来满足下面的功能, 具体使用请继续阅读文章内容.

本文不会对 Parcel 的基础使用再多做解释, 如果您还没有接触过 Parcel ,请先去了解: [Parcel 官方文档-快速开始](https://zh.parceljs.org/getting_started.html)

## 如何跳过不需要打包的文件?

如果我们使用 `parcel index.html` 命令, Parcel 会自动识别html中的引用,如果是`http://`就不会进行打包处理, 如果是本地文件,就会识别成Assets对象,进行打包.

如果我们需要跳过对本地文件的打包, 我们可以使用 `parcel-plugin-change-file` 插件

```
$ yarn add -D parcel-plugin-change-file
```

在 index.html中添加 `<!--[ your-code ]-->` , 注意这里有两个中括号.

```html
<body>
  <!--[ <script src="lodash.min.js"></script> ]-->
</bodt>
```
当项目编译结束之后, 该插件会把 `<!--[ your-code ]-->` 的注释内容打开,从而跳过 Parcel 的打包检测.
```html
<body>
  <script src="lodash.min.js"></script>
</bodt>
```

## 如何对html进行修改?
例如, 我们尝试根据 `package.json` 中的信息修改 `index.html` 的 `title`

在项目跟路径创建 parcel-plugin-change-file.js 文件

```js
const package = require('./package.json')
module.exports = {
  html: [package.name],
};
```
在 `src/index.html` 中添加 `<!-- parcel-plugin-change-file[i] -->` , 其中 `i` 对应之前 `html` 对象中的数组下标, 这里我们只有一个, 所以用 `0`
```
<header>
  <title><!-- parcel-plugin-change-file[0] --></title>
</header>
```

当项目编译结束之后, 该插件会把 `package.json` 中的 `name` 信息插入到 `title`
```html
<body>
  <title>Parcel优雅配置</title>
</bodt>
```

## 如何在parcel打包结束之后拷贝一些文件到打包目录?

例如, 某些情况, 我们不需要 Parcel 帮我们处理 `png` 图片, 我们希望直接使用图片路径:
```js
class Banner extends React.Componet {
  render(){
    return <div style={{
      backgoundImage:'img/test.png'
    }} ></div>
  }
}
```
那我们就需要在打包之后再把图片拷贝到相应的路径.

还是确保`parcel-plugin-change-file` 已被安装, 然后在项目跟路径创建`parcel-plugin-change-file.js`

```
module.exports = {
  copy: ['src/assets', 'src/documents'],
};
```

正常执行 Parcel 打包脚本, 就会把 `src/assets` 和 `src/documents` 的**子内容**拷贝到打包输出的**跟路径**
```
$ parcel src/index.html
```


## 如何达到和 `webpack.DllPlugin` 一样的预先编译的效果呢?

Webpack 的 DllPlugin 插件可以把一些不常进行修改的库提前编译成一个文件, 然后在项目里引用, 经过配置webpack不会再次编译这些已经编译过的文件.这样可以大大的加速平时编译的时间. 从而赶上 Parcel 的打包速度.

而在 Parcel 中,也可以可以把一些不常进行修改的库提前编译成一个文件, 这样可以在 Parcel 原本就快速的编译前提下再减去绝大部分的编译内容, 从而极大的加速平时编译的时间, 不过就只能使用全局对象引用了.

在Parcel项目中, 是可以使用全局对象的, 例如我们在html中引入一个lodash:

```html
<body>
    <script src="https://cdn.bootcss.com/lodash.js/4.17.9/lodash.min.js"></script>
</body>
```

此时, 在项目中不需要`import _ from 'lodash'`, 可以识别全局`_`对象的
```js
console.log(_.map)  //可以打印出 _.map 方法
```
### 有了以上知识点,我们可以这样做:

1. 创建一个预先需要打包的文件:

目录:`项目根目录/dll/default.js`

```
// 假设这些库是自己编写的库, 需要在预编译, 并且在全局引用
import _ from 'lodash';
import Immutable from 'immutable';

window['_'] = _;
window['Immutable'] = Immutable;

```

2. 使用Parcel进行打包, 其中`changeFile=false` 是不使用 parcel-plugin-change-file 插件:

```
$ changeFile=false parcel build dll/default.js -d src/dll -o defalut.min.js
```

3. 我们需要在html里引入 `src/dll/default.min.js`

```html
<head>
    <!--[ <script src="default.min.js"></script> ]-->
</head>
```

4. 创建parcel-plugin-change-file.js

```js
module.exports = {
  copy: ['src/dll'],
};
```

5. 大功告成,可以在项目里直接使用

```
_.map(_.range(500), v=>{
  console.log(`hello:${v}`);
})
```
启动项目:
```
$ parcel src/index.html
```

### 最后, 如果这篇文章有帮到你, 欢迎 Star: [parcel-plugin-change-file](https://github.com/ymzuiku/parcel-plugin-change-file)

