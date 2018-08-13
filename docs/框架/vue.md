# Vue
## Vue响应式原理
Vue的响应式实现分为：
1. 在生命周期的 initState 方法中将 data、prop 中的数据劫持，通过 observe 方法与 defineReactive 方法将相关对象转换为 Observer 对象；
2. 在 initRender 方法中解析模板，通过 Watcher 对象，Dep 对象与观察者模式将模板中的指令与对应的数据建立依赖关系，在这个依赖收集的过程中，使用了全局对象 Dep.target ；
3. 当数据发生改变时，触发`Object.defineProperty`方法中的`dep.notify`方法，遍历该数据的依赖列表，执行其`update`方法通知`Watcher`进行视图更新。。

### 追踪变化
   
当你把一个普通的 JavaScript 对象传给 Vue 实例的`data`选项，Vue 将遍历此对象所有的属性，并使用`Object.defineProperty`把这些属性全部转为 getter/setter。

每个组件实例都有相应的`watcher`实例对象，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的`setter`被调用时，会通知`watcher`重新计算，从而致使它关联的组件得以更新。
### Observer、Watcher、Dep
**Observer**
Vue 中的数据对象都会在初始化过程中转化为 Observer 对象。
**Watcher**
每个组件实例都有相应的`watcher`实例对象，`watcher`负责重新计算对应数据，并更新关联的组件。
**Dep**
Dep 类是 Watcher 和 Observer 之间的纽带。每一个 Observer 都有一个 Dep 实例，用来存储订阅者 Watcher。