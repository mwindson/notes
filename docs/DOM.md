<!-- TOC -->

- [DOM](#dom)
  - [创建节点](#创建节点)
    - [创建元素节点](#创建元素节点)
    - [创建文本节点](#创建文本节点)
    - [创建文档段](#创建文档段)
  - [合并文本节点](#合并文本节点)
  - [分割文本节点](#分割文本节点)
  - [添加节点](#添加节点)
  - [复制节点](#复制节点)
  - [替换节点](#替换节点)
  - [移除节点](#移除节点)
  - [查找节点](#查找节点)
  - [遍历节点](#遍历节点)
  - [对元素属性进行操作](#对元素属性进行操作)
  - [修改 DOM 的技巧](#修改-dom-的技巧)
  - [为什么建议用 document.createDocumentFragment](#为什么建议用-documentcreatedocumentfragment)

<!-- /TOC -->

# DOM

## 创建节点

### 创建元素节点

`createElement`

```javascript
p = document.createElement('p')
p.nodeType // 1
```

### 创建文本节点

`createTextNode`

```javascript
textNode = document.createTextNode('I am text node')
textNode.nodeType // 3
```

### 创建文档段

`createDocumentFragment()`
创建一个 DOM 片段，在其中组装一个 DOM 子树，然后使用 Node 诸如 `appendChild()`或`insertBefore()`之类的接口方法将该片段附加或插入到 DOM 中。

## 合并文本节点

`normalize`：在父节点调用，父节点的两个相邻的文本子节点会合成一个文本节点。

## 分割文本节点

`splitText`：参数为一个以 0 开始的文本下标索引。以此分割，参数左为一个文本节点，参数及右为另一个文本节点。

## 添加节点

`appendChild`：在父节点的`childNodes`末尾添加子节点，如果节点已存在那么移动到末尾。

`insertBefore`：在父节点`childNodes`的某一节点前插入节点

`innerHTML`：通过`innerHTML`替换子树

```javascript
parentNode.appendChild(nodeInsert)
parentNode.insertBefore(nodeInsert, nodeExist) 
// 如果nodeExist为null，那么等同于appendChild()
```

## 复制节点

`cloneNode(bool)`

```javascript
nodeA.cloneNode(ture)// 默认为false
/**
 * 参数为布尔值，参数设为true则进行深复制，会复制节点及其整个子树；
 * 参数为false进行浅复制，只复制节点，不克隆它的任何子节点，该节点所包含的所有文本也不会被克隆；
 * cloneNode()会会拷贝所有的属性以及属性值，并不复制用JavaScript动态绑定的事件
 */
```

## 替换节点

`replaceChild`

```javascript
parentNode.replaceChild(newNode, oldNode)
```

## 移除节点

`removeChild`

```javascript
parentNode.removeChild(childNode)
```

## 查找节点

`getElementById`：根据 id 属性查找元素

`getElementsByClassName`：根据 class 属性查找元素

`getElementsByTagName`：根据元素标签查找元素

`getElementsByName`：根据 name 属性查找元素

`querySelector`：查找第一个符合条件的元素

`querySelectorAll`：查找所有符合条件的元素

## 遍历节点

`parentNode`：遍历到当前结点的父节点

`firstChild`：第一个子节点

`lastChild`：最后一个子节点

`nextSibling`：后一个兄弟节点

`previousSibling`：前一个兄弟节点

## 对元素属性进行操作

`getAttribute`：获取对应属性名的属性值

`setAttribute`：设置对应属性名的属性值

`removeAttribute`：删除对应属性名的属性值

`getAttributeNames()`：获取节点的所有属性名

`hasAttribute(attName)`：是否包含指定的属性

## 修改 DOM 的技巧

- 如果想用 JS 修改元素的样式，最好通过改变元素的 class 名，并尽可能在 DOM 树最末端的节点上修改（例如可以想办法只修改元素子节点上的 class）

- 不要多次修改 DOM，可以使用`document.createDocumentFragment()`把要改的 DOM 节点缓存起来 在内部修改，再一次性添加进 HTML 中

- 将要修改的 DOM 节点设置 display:none，会有一次 repaint，接着可以多次修改，修改完后再设置为 display:block

## 为什么建议用 document.createDocumentFragment

如果不使用`createDocumentFragment`，那么在插入 document 时，被插入的元素样式表会
进行计算，如此时`window.getComputedStyle`会得到计算值，这样会造成`reflow`。

而插入 document fragment 时，则不会进行计算。

`script`节点同样只有在插入 document 时，才会被 parse 和执行。

现代浏览器会对频繁插入节点的情况进行优化，延后相关不必要的计算，避免性能问题，但依然建议用`document.createDocumentFragment`。
