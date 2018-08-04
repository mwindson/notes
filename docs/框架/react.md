# React

## 特点

1.  专注视图层
    React 提供了 View 层的解决方案。
2.  Virtual DOM
    React 将真实 DOM 树转换为 JS 对象树，保存在内存中，state 发生变化时，根据 state 生成新的 virtualDOM，并且通过 diff 算法进行比对，只更新被改变的内容。这样避免了 js 引擎频繁调用渲染引擎渲染 DOM，优化了性能。
    另外，有了 virtalDOM,可以容易地进行跨平台开发，如 ReactNative。

## 事件系统

1.  事件委派
    React 会把所有事件绑定在结构最外层，组件挂载或卸载时，会在事件监听器上插入或删除一些对象。
    事件发生时，会首先被统一的事件监听器处理，然后找到对应的事件处理函数调用，通过**事件冒泡**进行委派。
2.  自动绑定
    方法会绑定在组件上。
3.  原生事件
    通过`refs`来调用原生事件（在组件卸载时，需要手动溢出，否则会内存泄漏）。

## 生命周期

## React 16.3 变化

### 生命周期

#### static getDerivedStateFromProps(nextProps,prevState)

1.  替换了 WiiMount 和 WillReceiveProps

2.  触发时期

    - 组件 Mount 前
    - 传入 props 发生变化时
    - 父组件导致本组件重渲染时触发，此时无论传入 props 是否改变都会触发，需要比较

3.  注意点

    - 返回一个 Object 用于更新 state 或者 返回 null 用于不更新对象

      无需再手动 setState

    - Mount 前的 nextProps 值为初次传入的 props，prevState 的值为 constructor 中的 this.state 值

#### componentWillUpdate => getSnapshotBeforeUpdate(prevProps,prevState)

1.  替换了 WillUpdate
2.  返回值会传递给`componentDidUpdate(prevProps.prevState,snapshot)` 的第三个参数`snapshot`

### 新的 Refs

`React.createRef()`

```javascript
this.myRef = React.createRef()
const node = this.myRef.current
```

- ref 在 html 元素上=> current： Dom 元素
- ref 在组件上=> current：组件的实例
- ref 不能在函数组件上 => 因为无实例

### context API

1.  createContext

```javascript
// defaultValue: 当Consumer没有对应Provider提供的value时作为默认的value
const { Provider, Consumer } = React.createContext(defaultValue)
```

2.  Provider

```javascript
// 提供Consumers所用的值
<Provider value={/* some value */}>
```

3.  Consumer

```javascript
<Consumer>
  {value => /* render something based on the context value */}
</Consumer>
```

- 所有 consumers 会在 Provider 值变化时重渲染(Object.is()来比较新旧值)
- Provider 的 value 不能直接传入{...}而应该提升为 state

## diff 经验与应对方法

## 受控组件与非受控组件

### 受控组件

通过 React 的 props 和 state 属性来保存表单组件相关的 vlaue，而不是将数据保存在表单 dom 上。

### 非受控组件

通过 refs 来访问底层 dom 元素，从而来操控数据。

## 跨组件通信

通过`EventEmitter`事件来实现，在`componentDidMount`添加监听，在`componentWillUnmount`移除监听。

## 性能优化

### PureComponent 和 shouldComponentUpdate

`shouldComponentUpdate`会将当前传入的 props 和 state 与之前的进行**浅比较**，如果使用`PureComponent`在返回 false 的情况下，组件不会进行 render。
为了避免深比较的性能问题和浅比较的局限性，使用 Immutable 可以优化 PureComponent  渲染。
