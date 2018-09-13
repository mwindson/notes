<!-- TOC -->

- [ES6](#es6)
  - [let const](#let-const)
  - [块级作用域](#块级作用域)
  - [函数](#函数)
  - [箭头函数](#箭头函数)
  - [扩展运算符(...)](#扩展运算符)
  - [可枚举](#可枚举)
  - [Symbol](#symbol)
  - [Proxy 对象](#proxy-对象)
  - [Promise 对象](#promise-对象)
  - [迭代器 Iterator](#迭代器-iterator)
  - [生成器 generator](#生成器-generator)
    - [原理](#原理)
    - [运行逻辑](#运行逻辑)
    - [for...of...](#forof)
    - [yield](#yield)
    - [return() 和 throw()](#return-和-throw)
  - [async](#async)
  - [class](#class)
    - [继承](#继承)
    - [私有方法](#私有方法)

<!-- /TOC -->

# ES6

## let const

`let`声明的变量必须在声明后使用，不存在变量提升。

`let`声明的变量会绑定在作用域中，不受外界变量影响，在声明之前变量不可用。

## 块级作用域

块级作用域之中，函数声明语句的行为类似于`let`，在块级作用域之外不可引用

外层作用域无法读取内层作用域的变量。

内层作用域可以定义外层作用域的同名变量 。

## 函数

默认参数，惰性求值

指定了默认值以后，函数的`length`属性，将返回没有指定默认值的参数个数，如果设置了默认值的参数不是尾参数，那么`length`属性也不再计入后面的参数了。

设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域。

不定参数：`fn(...变量名)`，代替`arguments`

## 箭头函数

非箭头函数有自己的`this`，箭头函数没有自己的`this`，而是从自己的作用域链的上一层继承`this`。

由于箭头函数没有自己的`this`，通过`call`或`apply`方法调用一个函数时，只能传递参数，第一个参数会被忽略。

## 扩展运算符(...)

将一个数组转为用逗号分隔的**参数序列**。

```javascript
Math.max(...[14, 3, 77])
// 等同于
Math.max(14, 3, 77);
list=[1,2,3]
[a, ...rest] = list // a=1 rest=[2,3]
```

## 可枚举

目前，有四个操作会忽略`enumerable`为`false`的属性。

- `for...in`循环：只遍历对象自身的和继承的可枚举的属性。
- `Object.keys()`：返回对象自身的所有可枚举的属性的键名。
- `JSON.stringify()`：只串行化对象自身的可枚举的属性。
- `Object.assign()`： 忽略`enumerable`为`false`的属性，只拷贝对象自身的可枚举的属性。

## Symbol

ES6 新引入的原始数据类型，每一个 symbol 是独一无二，互不相等，从而保证变量互不冲突。
`Symbol.for`接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 Symbol 值。如果有，就返回这个 Symbol 值，否则就新建并返回一个以该字符串为名称的 Symbol 值。

```javascript
Symbol.for('bar') === Symbol.for('bar') // true
Symbol('bar') === Symbol('bar') // fasle
```

## Proxy 对象

用于代理,修改部分原有的操作。

```javascript
// target:要代理的目标对象，handler:目标对象操作和对应的代理函数的handler对象
var proxy = new Proxy(target, handler)
```

支持的操作：

- get(target, propKey, receiver)：拦截对象属性的读取，比如 proxy.foo 和 proxy['foo']。
- set(target, propKey, value, receiver)：拦截对象属性的设置，比如 proxy.foo = v 或 proxy['foo'] = v，返回一个布尔值。
- has(target, propKey)：拦截 propKey in proxy 的操作，返回一个布尔值。
- deleteProperty(target, propKey)：拦截 delete proxy[propKey]的操作，返回一个布尔值。
- ownKeys(target)：拦截 Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in 循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而 Object.keys()的返回结果仅包括目标对象自身的可遍历属性。
- getOwnPropertyDescriptor(target, propKey)：拦截 Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。
- defineProperty(target, propKey, propDesc)：拦截 Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。
- preventExtensions(target)：拦截 Object.preventExtensions(proxy)，返回一个布尔值。
- getPrototypeOf(target)：拦截 Object.getPrototypeOf(proxy)，返回一个对象。
- isExtensible(target)：拦截 Object.isExtensible(proxy)，返回一个布尔值。
- setPrototypeOf(target, proto)：拦截 Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
- apply(target, object, args)：拦截 Proxy 实例作为函数调用的操作，比如 proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。
- construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作，比如 new proxy(...args)。

**！！！代理之后，对象内部的`this`将指向 Proxy 代理**

```javascript
// Proxy 和 Reflect实现观察者模式
class Observable {
  constructor() {
    this.observers = new Set()
  }
  observe(fn) {
    this.observers.add(fn)
  }
  create(obj) {
    const self = this
    return new Proxy(obj, {
      set(target, key, value, receiver) {
        const result = Reflect.set(target, key, value, receiver)
        self.observers.forEach(observer => observer())
        return result
      }
    })
  }
}
const observable = new Observable()
const person = observable.create({
  name: '张三',
  age: 20
})

function print() {
  console.log(`${person.name}, ${person.age}`)
}

observable.observe(print)
person.name = '李四'
// 输出 "李四, 20"
```

## Promise 对象

Promise 对象有以下两个特点。

（1）对象的状态不受外界影响。Promise 对象代表一个异步操作，有三种状态：`pending`（进行中）、`fulfilled`（已成功）和 `rejected`（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。

（2）一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise 对象的状态改变，只有两种可能：从 pending 变为 fulfilled 和从 pending 变为 rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。如果改变已经发生了，你再对 Promise 对象添加回调函数，也会立即得到这个结果。

```javascript
// 异步请求，按顺序输出
promiseArray.reduce((res, prom) => {
  return res.then(() => prom)
}, Promise.resolve())
// 按顺序请求
array.reduce(
  (prev, curr) =>
    prev.then(
      () =>
        new Promise((resolve, reject) => {
          /*.....*/
        })
    ),
  Promise.resolve()
)
```

## 迭代器 Iterator

Iterator 的遍历过程是这样的。
（1）创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。
（2）第一次调用指针对象的`next`方法，可以将指针指向数据结构的第一个成员。
（3）第二次调用指针对象的`next`方法，指针就指向数据结构的第二个成员。
（4）不断调用指针对象的`next`方法，直到它指向数据结构的结束位置。 每次`next`方法会返回一个 value 和 done 两个属性的对象。
用 for...of 循环遍历某种数据结构时，该循环会自动去寻找 Iterator 接口。
用`Symbol.iterator`定义接口，并且一般用 generator 函数来实现。

```javascript
const iterable1 = new Object()
iterable1[Symbol.iterator] = function*() {
  yield 1
  yield 2
  yield 3
}
console.log([...iterable1])
// expected output: Array [1, 2, 3]
```

## 生成器 generator

### 原理

每当生成器执行`yields`语句，生成器的堆栈结构（本地变量、参数、临时值、生成器内部当前的执行位置）被移出堆栈。然而，生成器对象保留了对这个堆栈结构的引用（备份），所以稍后调用.next()可以重新激活堆栈结构并且继续执行。

### 运行逻辑

`generator`生成器在第一次调用时，不会立刻执行。
遍历器对象的`next`方法的运行逻辑如下。

1.  遇到`yield`表达式，就暂停执行后面的语句，并将紧跟在`yield`后面的那个表达式的值，作为返回的对象的`value`属性值。
2.  下一次调用`next`方法时，再继续往下执行，直到遇到下一个`yield`表达式。
3.  如果没有再遇到新的`yield`表达式，就一直运行到函数结束，直到 return 语句为止，并将 `return`语句后面的表达式的值，作为返回的对象的`value`属性值。
    （4）如果该函数没有`return`语句，则返回的对象的`value`属性值为`undefined`。

### for...of...

一旦 next 方法的返回对象的 done 属性为 true，for...of 循环就会中止，且不包含该返回对象

### yield

`yield*`会遍历后面有 Iterator 接口的数据结构，如数组、字符串等。

### return() 和 throw()

`return()`会终止遍历，并且返回的 value 值是`return`方法的参数。以后再调用 next 方法，done 属性总是返回 true。
`throw`方法可以接受一个参数，该参数会被 catch 语句接收，建议抛出 Error 对象的实例。

## async

`async`是`Generator`函数的语法糖。
`async`函数的返回值是`Promise`对象。
原理：就是将`Generator`函数和自动执行器，包装在一个函数里。

```javascript
// 并发请求，顺序输出
async function logInOrder(urls) {
  // 并发读取远程URL
  const textPromises = urls.map(async url => {
    const response = await fetch(url)
    return response.text()
  })

  // 按次序输出
  for (const textPromise of textPromises) {
    console.log(await textPromise)
  }
}
```

## class

默认采用严格模式。类的`this`默认指向类的实例。

### 继承

子类的构造函数中，只有调用 super 之后，才可以使用 this 关键字，否则会报错。这是因为子类实例的构建，基于父类实例，只有 super 方法才能调用父类实例。

在子类普通方法中通过 super 调用父类的方法时，方法内部的 this 指向当前的子类实例。

**静态方法**：在一个方法前，加上`static`关键字，就表示该方法不会被实例继承，而是直接通过类来调用。静态方法中的`this`指向类，而非实例。

- 方法不能给 this 引用,可以给类直接引用
- 静态不可以给实例调用,比如 `let a = new ParentClass => a.sayHello()` 会抛出异常
- 父类静态方法,子类非`static`方法没法覆盖父类
- 静态方法可以给子类继承
- 静态属性可以继承也可以被修改

**私有变量**

- 人为命名区分
- 利用闭包
- weakMap 可以避免内存泄露,当没有被值引用的时候会自动给内存寄存器回收

**与 es5 不同点**：

- class 不存在变量提升。
- ES5 的继承，实质是先创造子类的实例对象 this，然后再将父类的方法添加到 this 上面（Parent.apply(this)）。ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到 this 上面（所以必须先调用 super 方法），然后再用子类的构造函数修改 this。
- ES6 的子类和父类，子类原型和父类原型，通过**proto** 连接。

**es6 的继承用 es5 实现**

```javascript
function Parent() {}
function Child() {}
Child.prototype = Object.create(Parent && Parent.Prototype)
// es6
Object.setPrototypeOf(Child.prototype, Parent.prototype)
//es5
Child.prototype.__proto__ = Parent.prototype
//es6
Object.setPrototypeOf(Child, Parent)
//es5
Child.__proto__ = Parent
```

### 私有方法

没有提供，只能模拟实现

1.  命名区别
2.  Symbol 方法
    第三方无法获得 symbol 值,从而实现私有方法和私有属性
    ```javascript
    const bar = Symbol('bar')
    const snaf = Symbol('snaf')
    export default class myClass {
      /*公有方法 */
      foo(x) {
        this[bar](x)
      }
      /*私有方法*/
      [bar](x) {
        return (this[snaf] = x)
      }
      // ...
    }
    ```
