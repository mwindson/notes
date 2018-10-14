<!-- TOC -->

- [webpack](#webpack)
  - [原理](#原理)
  - [相关配置](#相关配置)
  - [优化](#优化)
  - [Code Splitting](#code-splitting)
  - [动态加载原理，如何实现](#动态加载原理如何实现)
  - [打包优化](#打包优化)
  - [webpack 实现 js require css 的原理](#webpack-实现-js-require-css-的原理)
  - [webpack loader 的原理，作用以及如何实现](#webpack-loader-的原理作用以及如何实现)
  - [Babel](#babel)

<!-- /TOC -->

# webpack

## 原理

1.  执行脚本 ./bin/webpack.js

2.  使用相关模块获取到配置对象，然后从./lib/webpack.js 中获取到 webpack 来进行编译

3.  调用 lib/WebpackOptionsApply.js 模块的 process 方法来逐一编译 webpack 编译对象的各项

4.  整个个 bundle.js 是一个自执行函数，前 65 行都在定义这个自执行函数，最后传入了一个数组作为参数，因为只有一个 js 文件，这里的数组长度为 1，并且数组里的每一个元素都是一个自执行函数，自执行函数中包含着 index.js 里的内容。

    即整个 bundle.js 文件是一个传入了 包含若干个模块的数组 作为参数，即**传入的 modules 是一个数组**。

5.  在这个 bundle.js 文件中的自执行函数中定义了一个 webpack 打包的函数 **webpack_require**, 这个函数是一个打包的核心函数， 接收一个 moduleId 作为参数，**moduleId 是一个数字，实际上就是整个自执行函数接收的数组参数的 index 值。** 即整个传入的 module 数组，每一个元素都是一个 module，我们为之定义一个特定的 moduleId，进入函数，首先判断要加载的模块是否已经存在，如果已经存在， 就直接返回 installedModules[moduleId].exports，这样就保证了所有的模块只会被加载一次，而不会被多次加载。 如果说这个模块还没有被加载，那么我们就创建一个 installedModules[moduleId]， 他是一个对象，包括 i 属性（即 moduleId），l 属性（表示这个模块是否已经被加载， 初始化为 false）, exports 属性它的内容是每个模块想要导出的内容， 接下来执行 modules[moduleId].call(module.exports, module, module.exports, **webpack_require**); 函数进行调用，那么这个函数具体是如何执行的呢？ 首先保证在 module.exports 上进行调用这个函数，然后传入了 module 参数，即我们想要调用的这个模块，传入 module.exports ，那么在每一个模块中使用的 module 和 module.exports 就都是属于这个模块的了， 同时再传入 **webpack_require**这样我们就可以在每一个模块中继续使用了加载器了，最后，导出这个模块。 调用完成之后，将 l 设置为 true，表示已经加载，最后导出 module.exports,即导出加载到的模块。

6.  在自执行函数的末尾最终返回了一个 **webpack_require** 调用，也就是说返回了一个模块，因为**webpck_require**函数本身就会返回一个模块。 并且这个 **webpack_require**调用接收的参数是一个 moduleId ，且指明了其值为 86。 **也就是说入口文件的 moduleId 为 86，** 我们来看一看模块 86 的内容是什么。**即在这个 bundle.js 函数执行之后，实际上得到的第一部分内容是 86 模块的内容**

`style-loader` :**将 css 代码添加到 html 中，这个模块中的的核心函数为 addStylesToDom**,内部对所有的 style 进行遍历， 然后添加进入。

webpack 的 loader 从右往左，从下往上执行

## 相关配置

## 优化

- 对于 Webpack4，打包项目使用 production 模式，这样会自动开启代码压缩
- 使用 ES6 模块来开启 tree shaking，这个技术可以移除没有使用的代码
- 优化图片，对于小图可以使用 base64 的方式写入文件中
- 按照路由拆分代码，实现按需加载
- 给打包出来的文件名添加哈希，实现浏览器缓存文件

## Code Splitting

Code Splitting 的具体做法就是一个分离点，在分离点中依赖的模块会被打包到一起，可以异步加载。一个分离点会产生一个打包文件。

```javascript
// 第一个参数是依赖列表，webpack会加载模块，但不会执行
// 第二个参数是一个回调，在其中可以使用require载入模块
// 下面的代码会把module-a，module-b，module-c打包一个文件中，虽然module-c没有在依赖列表里，但是在回调里调用了，一样会被打包进来
require.ensure(['module-a', 'module-b', 'module-c'], function(require) {
  var a = require('module-a')
  var b = require('module-b')
  var c = require('module-c')
})
```

1. 入口起点：使用 entry 配置手动地分离代码。
2. 防止重复：使用 CommonsChunkPlugin 去重和分离 chunk。
3. 动态导入：通过模块的内联函数调用来分离代码。

## 动态加载原理，如何实现

- webpack4 之前

  `require.ensure(dependencies, callback, chunkName)`

- webpack4

  利用 import() 做动态加载

  ```javascript
  import('./' + filename)
    .then(module => {
      console(module)
    })
    .catch(err => {
      console(err.message)
    })
  ```

## 打包优化

1. `resolve.alias` 重定向到压缩后代码而非引入源码
2. `module.noParse` 确定一个模块中没有其它新的依赖使用
3. `externals.xxx.true` 使用公用 CDN

## webpack 实现 js require css 的原理

## webpack loader 的原理，作用以及如何实现

`Loader`可以理解为是模块和资源的转换器，它本身是一个函数，接受源文件内容作为参数，返回转换的结果。从右向左，从上到下链式执行。

特点：

- 单一职责
- 链式组合
- 模块化
- 无状态

采用 node module 写法，简单的 loader 实现：

```javascript
// 引入依赖
var Minimize = require('minimize')
var loaderUtils = require('loader-utils')

// source 为字符串
module.exports = function(source) {
  var callback = this.async() // 不阻塞地异步进行
  if (this.cacheable) {
    // 启用缓存
    this.cacheable()
  }
  var opts = loaderUtils.getOptions(this) || {} // 拿到 loader的option
  // source进行压缩
  var minimize = new Minimize(opts)
  minimize.parse(source, callback)
}
```

## Babel

**ES6 代码输入 ==》 babylon 进行解析 ==》 得到 AST ==》 plugin 用 babel-traverse 对 AST 树进行遍历转译 ==》 得到新的 AST 树 ==》 用 babel-generator 通过 AST 树生成 ES5 代码**

`babel-preset-env` 允许你指定一个代码执行环境，并且只编译该环境缺少的特性。

`babel-polyfill` babel 预设可以编译几乎所有的 JavaScript 新语法，但是不能解决API。为解决这个问题， babel 用的是 babel-polyfill (它有 core-js 和 regenerator 两部分构成)。

`babel-plugin-tranform-classes`// 解决 ES6 类（class）的兼容性。
