<!-- TOC -->

- [React](#react)
  - [特点](#特点)
  - [事件系统](#事件系统)
  - [生命周期](#生命周期)
  - [setState 更新](#setstate-更新)
  - [diff 算法](#diff-算法)
  - [组件通信](#组件通信)
  - [React 16.3 变化](#react-163-变化)
    - [生命周期](#生命周期-1)
      - [static getDerivedStateFromProps(nextProps,prevState)](#static-getderivedstatefrompropsnextpropsprevstate)
      - [componentWillUpdate => getSnapshotBeforeUpdate(prevProps,prevState)](#componentwillupdate--getsnapshotbeforeupdateprevpropsprevstate)
    - [新的 Refs](#新的-refs)
    - [context API](#context-api)
  - [受控组件与非受控组件](#受控组件与非受控组件)
    - [受控组件](#受控组件)
    - [非受控组件](#非受控组件)
  - [性能优化](#性能优化)
    - [PureComponent 和 shouldComponentUpdate](#purecomponent-和-shouldcomponentupdate)
    - [Immutable](#immutable)
    - [动态子组件设置 key](#动态子组件设置-key)
  - [一些问题](#一些问题)
    - [在 setState 更新完成后执行一个事件](#在-setstate-更新完成后执行一个事件)
    - [React 安全](#react-安全)

<!-- /TOC -->

# React

## 特点

1.  专注视图层

    React 提供了 View 层的解决方案，数据决定视图，函数式思想。

2.  Virtual DOM

    React 将真实 DOM 树转换为 JS 对象树，保存在内存中，state 发生变化时，根据 state 生成新的 virtualDOM，并且通过 diff 算法进行比对，只更新被改变的内容。这样避免了 js 引擎频繁调用渲染引擎渲染 DOM，优化了性能。

3.  另外，有了 virtalDOM,可以容易地进行跨平台开发，如 ReactNative。
4.  组件化开发的思路，使组件可复用、可组合、可测试、可维护。
5.  生态环境好。
6.  提倡 Immutable，避免过度重新渲染。
7.  单向数据流，更容易对数据进行控制，找到数据源头。

## 事件系统

1.  事件委派

    React 会把所有事件绑定在结构最外层，组件挂载或卸载时，会在事件监听器上插入或删除一些对象。在 UI 系统中，事件处理器越多，那么占据的内存就越大，React 的做法是将其简化为一个，这样就大大提高了效率。

    事件发生时，会首先被统一的事件监听器处理，然后找到对应的事件处理函数调用，通过**事件冒泡**进行委派。

2.  自动绑定

    方法会绑定在组件上。

3.  原生事件

    通过`refs`来调用原生事件（在组件卸载时，需要手动溢出，否则会内存泄漏）。

## 生命周期

- 首次挂载：

  `getDefaultProps`->`getInitialState`->`componentWillMount`->`render`->`componentDidMount`

- 卸载组件：

  `componentWillUnmount`

- 重新挂载：

  `getInitialState`->`componentWillMount`->`render`->`componentDidMount`

- 再次渲染，组件更新：

  `componentWillReceiveProps`->`shouldComponentUpdate`->`componentWillUpdate`->`render`->`componentDidUpate`

- state 改变：

  `shouldComponentUpdate`->`componentWillUpdate`->`render`->`componentDidUpdate`

- setState 的时机

  `componentWillMount`、`componentDidMount`、`componentWillReceiveProps`、`componentDidUpdate`

## setState 更新

`setState`通过状态队列机制来更新`state`。`setState`第二个参数是回调函数，会在 state 更新后被调用。

## diff 算法

见 https://reactjs.org/docs/reconciliation.html

策略：

1.  Web UI 中 DOM 节点跨层级的移动比较少。
2.  拥有相同类的两个组件会生成相似的树形结构，拥有不同类的两个组件将会生成不同的树形结构。
3.  对于同一层级的一组子节点，通过唯一的 id 进行区分。

算法：

1.  tree diff：基于策略一，两个树只会对同一层次的节点进行比较。建议不要进行 DOM 节点跨层级的操作。
2.  component diff：基于策略二，如果是同一类型的组件，那么继续比较；如果不是将组件判断为 dirty component，并替换整个组件下所有节点。同一类型组件比较会浪费大量 diff 时间，可以用`shouldComponentUpdate()`自主判断进行 diff 算法，节省时间。
3.  element diff：对节点进行插入、移动和删除三类操作。基于策略三，对同一层级的同组子节点，添加唯一 key 进行区分，提升性能。应该减少将最后一个节点提升到列表首部的操作。

## 组件通信

1.  父子组件通信

    父组件通过 props 向子组件传递数据；子组件通过调用父组件传递的函数向父组件传递数据。

2.  跨组件通信
    - 通过`EventEmitter`事件来实现，在`componentDidMount`添加监听，在`componentWillUnmount`移除监听。
    - 层层传递 props 和回调函数
    - 利用`context`API 来传递数据

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
2.  返回值会传递给`componentDidUpdate(prevProps,prevState,snapshot)` 的第三个参数`snapshot`

### 新的 Refs

`React.createRef()`

```javascript
this.myRef = React.createRef()
const node = this.myRef.current
```

- ref 在 html 元素上 => current： Dom 元素
- ref 在组件上 => current：组件的实例
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

## 受控组件与非受控组件

### 受控组件

通过 React 的 props 和 state 属性来保存表单组件相关的 vlaue，而不是将数据保存在表单 dom 上。

### 非受控组件

通过 refs 来访问底层 dom 元素，从而来操控数据。

## 性能优化

### PureComponent 和 shouldComponentUpdate

`shouldComponentUpdate`会将当前传入的 props 和 state 与之前的进行**浅比较**。

`PureComponent`实现`ShouldComponent`的默认方法不同。`PureComponent`默认情况下会对前后的 props 和 state 进行浅比较，`Component`会默认返回 true。

### Immutable

另外，为了避免原地修改产生的问题，需要`Immutable`不可变的对象。同时，为了避免深比较的性能问题，使用`Immutable.is`可以优化性能。

`Immutable`可以通过`is`快捷准确进行比较。

`Immutable`内部使用了 trie 数据结构来存储，只要两个对象的 hashCode 相等，值就是一样，可以避免深度遍历进行比较，优化性能。

### 动态子组件设置 key

当同一层子组件发生变化时，diff 算法在设置 key 时能更好地进行对比，减少重渲染。

## 一些问题

### 在 setState 更新完成后执行一个事件

1.  在`didUpdate()`生命周期时执行
2.  在`setState()`的第二个参数传入事件函数，可以在更新完成后执行。

### React 安全

React 会对字符进行转译替换成字符串，从而保证了安全性
