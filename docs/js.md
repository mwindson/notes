# javascript

```javascript
const a = 'test'
a.len = 4
a.len // undefined
```

`string.replace()`默认替换第一个字符，全部替换要用正则`/***/g`

## **== 类型转换**

## 变量

**变量提升**：使用`var`变量声明或函数声明会被提升到作用域的顶部。使用`let`或`const`的声明不会发生`变量提升`。

**执行上下文**：

- JS 有`执行上下文`
- 浏览器首次载入脚本，将创建`全局执行上下文`，并压入执行栈栈顶（不可被弹出）
- 然后每进入其它作用域就创建对应的执行上下文并压入执行栈的顶部
- 一旦对应的上下文执行完毕，就从栈顶弹出，并将上下文控制权交给当前的栈。
- 这样依次执行（最终都会回到全局执行上下文）

**作用域**

- 全局作用域
- 函数（局部）作用域 ——函数作用域的同名变量会遮盖全局作用域的同名变量
- 块级作用域（es6）

**作用域链**

1.  在函数上下文中，查找一个变量 foo
2.  如果函数的 VO 中找到了，就直接使用
3.  否则去它的父级作用域链中（**parent**）找
4.  如果父级中没找到，继续往上找
5.  直到全局上下文中也没找到就报错

## this

**this 是执行上下文环境的一个属性，而不是某个变量对象的属性**。

this 是没有一个类似搜寻变量的过程，当代码中使用了 this，这个 this 的值就直接从执行的上下文中获取了，而不会从作用域链中搜寻，this 的值只取决中进入上下文时的情况。

非严格模式下 this 默认为全局对象 window 或者 global，严格模式下为 undefined。

```javascript
var baz = 200
var bar = {
  baz: 100,
  foo: function() {
    console.log(this.baz)
  }
}
var foo = bar.foo

// 进入环境：global
foo() // 200，严格模式中会报错，Cannot read property 'baz' of undefined

// 进入环境：global bar
bar.foo() // 100

bar = {
  baz: 100,
  foo: () => console.log(this.baz) // 此处this为bar的上下文
}
bar.foo() //200
```

## 对象

**原型**：`xxx.__proto__`指向对象的原型
**原型链**：查询属性 x：对象 o ->对象 o 的原型 -> 对象 o 原型的原型 -> .. 直到找到 x 或找到 Object.prototype(`Object.prototype.__proto__ 为null`)为止
**构造函数**：`xxx.prototype`指向实例的原型（即类），原型通过构造函数创建实例

**原型继承**

- es5：`Object.create()`

- es3:

  ```javascript
  function inherit(p) {
    function f() {}
    f.prototype = p
    return new f()
  }
  ```

![img](https://github.com/mqyqingfeng/Blog/raw/master/Images/prototype5.png)

`hasOwnProperty()`检测是否是自由属性。

`propertyIsEnumberable()`检测是否是自有属性且可枚举。

**属性遍历**

`for...in...`可以遍历可枚举属性（自有属性和继承的属性），内置方法不可枚举。

es5 中新增`Object.keys()`（只有可枚举的属性）和`Object.getOwnPropertyNames()`（包括不可枚举的属性）方法

## 函数

- 作为函数调用

  函数声明语句会被“提前”到外部作用域的顶部。

  函数可以访问嵌套的外部函数的参数和变量。

  es3 和非严格模式中，this 的值是全局对象；严格模式下，this 的值是 undefined。

- 作为方法调用

  作为对象的方法。方法函数中，this 的值是对象。

  **链式调用**：在方法函数中返回 this。

  this 不会继承，只跟作为方法调用（**对象**）还是函数调用（全局对象或 undefined）有关。

- 作为构造函数调用

  new 调用

- 间接调用 — **call**和**apply**

  **call**：以参数列表传入

  **apply**：以数组形式传入

  ```javascript
  f.call(o) // 或 f.apply(o)
  // 等价于
  o.m = f
  o.m()
  delete o.m
  ```

  **bind**：将函数绑定到对象上，成为方法(与 call,apply 不同，返回一个函数而不是直接调用)

  ```javascript
  g = f.bind(o)
  g() // 等价于 o.f()
  // bind 实现柯里化
  const sum = function(x, y) {
    return x + y
  }
  const succ = sum.bind(null, 1)
  succ(2) // 3
  succ(3) // 4
  ```

`arguments.callee`参数当前正在执行的函数

函数属性：函数即对象，可以定义函数的属性来保存数据。（可以用闭包实现）

```javascript
func.counter = 0
function func() {
  return func.counter++
}
```

### 闭包

### 继承

es5 和 es6 继承的区别

## 垃圾回收

js 会自动进行垃圾回收机制。

Javascript 引擎基础 GC 方案是标记清除，遍历所有可访问的对象，回收已不可访问的对象。

缺点：**GC 时，停止响应其他操作**
优化：

- 分代回收：多回收临时对象，少回收持久对象。
- 增量回收：每次处理一点，下次再处理一点。

### 内存泄漏

1.  部分闭包造成的循环引用。

## Event Loop

事件循环是 js 代码执行的逻辑。

- JS 分为同步任务和异步任务
- 同步任务都在主线程上执行，形成一个`执行栈`
- 主线程之外，**事件触发线程**管理着一个`任务队列`，只要异步任务有了运行结果，就在`任务队列`之中放置一个事件。
- 一旦`执行栈`中的所有同步任务执行完毕（此时 JS 引擎空闲），系统就会读取`任务队列`，将可运行的异步任务添加到可执行栈中，开始执行。

![js的事件循环](imgs/js_event_loop.png)

**macrotask 与 microtask**

在一个 macrotask（如主代码）结束后，会优先执行 microtask，再执行下一个 macrotask。

- macrotask：**主代码块**，setTimeout，setInterval 等（可以看到，事件队列中的每一个事件都是一个 macrotask）
- microtask：Promise，process.nextTick 等

![macrotask和microtask](imgs/js_macrotask_microtask.png)

**在 node 环境下，process.nextTick 的优先级高于 Promise**

## 其他

`for...in...`转换为可枚举的对象后，根据对象的属性（字符串）来进行遍历

`for...of...`

## 严格模式

## window 对象

Element 对象有 style 和 className 属性，允许修改 css 样式和类名。

### onload 事件

当文档内容稳定并可以操作时会触发。

## html 中 javascript 程序执行过程

1.  载入文档内容，并执行`<script>`元素里的代码，按照出现和从上往下的顺序执行。
2.  文档载入完并且脚本执行完后，进入事件驱动阶段：触发 load 事件，并调用事件处理程序函数（鼠标和键盘等事件）。

javascript 脚本的加载默认是同步和阻塞的。`defer`属性会延迟脚本的执行直到文档的载入和解析完成。`async`属性会让浏览器尽可能快执行脚本，两者皆有时会遵从`async`属性。

## 模块化

### commonjs

服务器端模块的规范。`require`是同步的，但浏览器天生异步，无法正常加载模块。因为同步的加载模块会对性能，可用性，debug 调试，跨域访问产生问题。

```javascript
let { stat, exists, readFile } = require('fs')
```

### AMD

AMD 是`Asynchronous Module Definition`的缩写，例如`requirejs`。
采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。
`requireJS`使用之前必须配置，同时该配置很难重用。

### UMD

UMD 是 commonjs 和 AMD 的混合。UMD 的实现很简单：

1.  先判断是否支持 Node.js 模块格式（exports 是否存在），存在则使用 Node.js 模块格式。
2.  再判断是否支持 AMD（define 是否存在），存在则使用 AMD 方式加载模块。
3.  前两个都不存在，则将模块公开到全局（window 或 global）

### CMD

`CMD`即`Common Module Definition`通用模块定义。`CMD`和`AMD`在模块定义方式和模块加载（可以说运行、解析）时机上有所不同。

```javascript
define(function(require, exports, module) {
  // 模块代码
})
```

`AMD`是依赖关系前置,在定义模块的时候就要声明其依赖的模块;
`CMD`是按需加载依赖就近,只有在用到某个模块的时候再去 require;

### es6 module

ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。
