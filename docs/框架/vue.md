# Vue

## Vue 响应式原理

Vue 的响应式实现分为：

1. 在生命周期的 initState 方法中将 data、prop 中的数据劫持，通过 observe 方法与 defineReactive 方法将相关对象转换为 Observer 对象；
2. 在 initRender 方法中解析模板，通过 Watcher 对象，Dep 对象与观察者模式将模板中的指令与对应的数据建立依赖关系，在这个依赖收集的过程中，使用了全局对象 Dep.target ；
3. 当数据发生改变时，触发`Object.defineProperty`方法中的`dep.notify`方法，遍历该数据的依赖列表，执行其`update`方法通知`Watcher`进行视图更新。。

### 追踪变化

当你把一个普通的 JavaScript 对象传给 Vue 实例的`data`选项，Vue 将遍历此对象所有的属性，并使用`Object.defineProperty`把这些属性全部转为 getter/setter。

![data](https://cn.vuejs.org/images/data.png)

每个组件实例都有相应的`watcher`实例对象，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的`setter`被调用时，会通知`watcher`重新计算，从而致使它关联的组件得以更新。

### Observer、Watcher、Dep

**Observer**

Vue 中的数据对象都会在初始化过程中转化为 Observer 对象。

**Watcher**

每个组件实例都有相应的`watcher`实例对象，`watcher`负责重新计算对应数据，并更新关联的组件。

**Dep**

Dep 类是 Watcher 和 Observer 之间的纽带。每一个 Observer 都有一个 Dep 实例，用来存储订阅者 Watcher。

## React 与 Vue

React 和 Vue 有许多相似之处，它们都有：

- 使用 Virtual DOM
- 提供了响应式 (Reactive) 和组件化 (Composable) 的视图组件。
- 将注意力集中保持在核心库，而将其他功能如路由和全局状态管理交给相关的库。

### 优化

在 React 应用中，当某个组件的状态发生变化时，它会以该组件为根，重新渲染整个组件子树。

如要避免不必要的子组件的重渲染，你需要在所有可能的地方使用 `PureComponent`，或是手动实现 `shouldComponentUpdate` 方法。同时你可能会需要使用不可变的数据结构来使得你的组件更容易被优化。

然而，使用 `PureComponent` 和 `shouldComponentUpdate` 时，需要保证该组件的整个子树的渲染输出都是由该组件的 props 所决定的。如果不符合这个情况，那么此类优化就会导致难以察觉的渲染结果不一致。这使得 React 中的组件优化伴随着相当的心智负担。

在 Vue 应用中，组件的依赖是在渲染过程中自动追踪的，所以系统能精确知晓哪个组件确实需要被重渲染。你可以理解为每一个组件都已经自动获得了 `shouldComponentUpdate`，并且没有上述的子树问题限制

**学习难度**

Vue 可以只用 vue 文件来编写，替换成 min 文件即可；React 推荐写法需要学习 es6 等，并且用 Babel 等转译

Vue 的路由库和状态管理由官方维护

Vue 默认推荐模版；React 使用 Jsx
