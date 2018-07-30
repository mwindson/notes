## React
### 特点
### 生命周期
### 16.3变化
### diff经验与应对方法
### 受控组件与非受控组件
### shouldComponentUpdate
### virtualDOM优势
将DOM放在内存中，state发生变化时，根据state生成新的virtualDOM，并且通过diff算法进行比对，只更新被改变的内容。这样避免了js引擎频繁调用渲染引擎渲染DOM，优化了性能。
另外，有了virtalDOM,可以容易地进行跨平台开发，如ReactNative。
