# DOM

## 获取节点的方法

getElementById、getElementsByClassName、getElementsByTagName、 getElementsByName、querySelector、querySelectorAll

## 对元素属性进行操作

getAttribute、 setAttribute、removeAttribute 方法

## 对节点进行增删改

appendChild、insertBefore、replaceChild、removeChild、 createElement 等

## 修改 DOM 的技巧

- 如果想用 JS 修改元素的样式，最好通过改变元素的 class 名，并尽可能在 DOM 树最末端的节点上修改（例如可以想办法只修改元素子节点上的 class）

- 不要多次修改 DOM，可以使用 document.createDocumentFragment() 把要改的 DOM 节点缓存起来 在内部修改，再一次性添加进 HTML 中

- 将要修改的 DOM 节点设置 display:none，会有一次 repaint，接着可以多次修改，修改完后再设置为 display:block
