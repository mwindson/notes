# CSS

## 盒子模型

模型：**W3C 盒子模型** 和 **IE 盒子模型**
范围：margin、border、padding、content
区别：IE 盒子模型的 content 部分包含了 border 和 padding
设置：`box-sizing`默认为`content-box`，一般设置为`border-box`

## display

`block`:块级元素，宽高可以设置，默认宽度 100%，高度由内容决定
`inline`:行内元素，不可以设置宽高，由内容决定。
`inline-block`:可以设置宽高，但是表现为一行。
行内元素之间的空白符：行内元素之间会保留代码中的空白符；
最好的解决方法：在外层元素上设置 font-size:0;同时在内层元素上指定字体具体的大小。

## position

元素按照其在 HTML 中的位置顺序决定排布的过程。并且这种过程遵循标准的描述。
`relative`:设置了相对定位之后，通过修改 top,left,bottom,right 值，元素会在自身文档流所在位置上被移动，其他的元素则不会调整位置来弥补它偏离后剩下的空隙。
`absoulute`:设置的元素会脱离文档流。偏移是相对于是它最近的设置了定位属性（position 值不为 static）的元素。其他文档元素会弥补留下位置。
`fixed`:偏移位置相对于可视窗口

## 样式计算权重

id 选择器 > 类，属性选择器和伪类选择器 > 元素和伪元素

## css 解析顺序

CSS 匹配不是从左到右进行查找，而是从右到左进行查找。如果从左到右的顺序，那么每条选择器都需要遍历整个 DOM 树，性能很受影响。所谓高效的 CSS 就是让浏览器在查找 style 匹配的元素的时候尽量进行少的查找, 所以选择器最好写的简洁一点

## 布局

### 盒内布局

### 盒间布局

#### 脱离正常流

1.  absolute 布局
2.  float 布局

#### 正常流

1.  BFC
2.  IFC
3.  FFC
4.  table
5.  grid

### 双栏布局

```html
<div class="box1">
  <div class="left"></div>
  <div class="right">两列自适应</div>
</div>
```

1.  浮动

```css
.box1 .left {
  float: left;
  width: 100px;
  height: 100px;
  background-color: red;
}
.box1 .right {
  margin-left: 100px;
  height: 100px;
  background-color: green;
}
```

2.  定位

```css
.box1 {
  position: relative;
  width: 100%;
  height: 100px;
}
.box1 .left {
  position: absolute;
  width: 100px;
  height: 100%;
  background-color: red;
}

.box1 .right {
  margin-left: 100px;
  width: 100%;
  height: 100%;
  background-color: green;
}
```

3.  flex

```css
.box1 {
  display: flex;
  height: 100px;
}
.box1 .left {
  width: 100px;
  height: 100%;
  background-color: red;
}

.box1 .right {
  flex: 1;
  height: 100%;
  background-color: green;
}
```

### 圣杯布局

圣杯布局和双飞翼布局目的是我们希望先加载的是中间的部分，然后再开始加载 left 和 right 两个相对来说不是很重要的东西。

圣杯布局给最外面加 padding, 让 padding-left 和 padding-right 的数值等于 left 和 right 的宽度，然后利用相对定位和 float 把他们再移动在两旁。

```html
<div class="box">
  <!--注意顺序-->
  <div class="middle">middle</div>
  <div class="left">left</div>
  <div class="right">right</div>
</div>
```

```css
.box {
  padding: 0 100px; /* 留出左右的距离*/
  height: 100px;
}
.box .middle {
  float: left;
  width: 100%;
  height: 100%;
  background-color: yellow;
}
.box .left {
  float: left;
  width: 100px;
  margin-left: -100%;
  background-color: red;
  position: relative;
  left: -100px; /*往左拉*/
  height: 100%;
}
.box .right {
  float: left;
  width: 100px;
  margin-left: -100px;
  background-color: green;
  position: relative;
  right: -100px;
  height: 100%;
}
```

### 双飞翼

```html
<div class="box">
  <div class="middle-wrap">
    <div class="middle"></div>
  </div>
  <div class="left"></div>
  <div class="right"></div>
</div>
```

```css
.box {
  position: relative;
  height: 100px;
}
.middle-wrap {
  position: relative;
  float: left;
  width: 100%;
  height: 100%;
}
.middle-wrap .middle {
  height: 100%;
  margin: 0 100px; /*留出距离*/
  background-color: yellow;
}
.left {
  float: left;
  width: 100px;
  margin-left: -100%;
  height: 100%;
  background-color: red;
}
.right {
  float: left;
  width: 100px;
  height: 100%;
  margin-left: -100px;
  background-color: green;
}
```

## 清除浮动

目的：清除因为浮动元素脱离正常流导致的高度塌陷。
方法:

1.  父元素定义`overflow:auto`(BFC)
2.  插入新的元素，样式设置`clear:both`
3.  父元素添加伪类`:after`，并设置`clear:both`

## BFC

内部的 Box 会在垂直方向，一个接一个地放置。
Box 垂直方向的距离由 margin 决定。属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠
每个元素的 margin box 的左边， 与包含块 border box 的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。
BFC 的区域不会与 float box 重叠。
BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。
计算 BFC 的高度时，浮动元素也参与计算

**触发 BFC**

1.  根元素
2.  float 属性不为 none
3.  position 为 absolute 或 fixed
4.  display 为 inline-block, table-cell, table-caption, flex, inline-flex
5.  overflow 不为 visible

## margin 相关

### 外边距合并（margin_collapsing）

当两个垂直外边距相遇时，它们将形成一个外边距。合并后的外边距的高度等于两个发生合并的外边距的高度中的较大者。
-webkit-margin-collapse:控制是否发生外边距叠加

```css
-webkit-margin-collapse: <collapse>(默认重叠) | <discard>(取消) | <separate>(分隔);
```

发生情况：

1.  元素自身叠加：当元素为空，上下外边距相遇时，就会产生。
    1.  元素没有 border 值
    2.  元素没有 padding 值
    3.  里面没有 inline 元素
    4.  没有 height 或 min-heigh
2.  相邻元素叠加：上下边距相遇，就会叠加。
3.  父子元素叠加：父级元素和第一个或最后一个子元素
    发生条件：
    1.  父元素不是 BFC 元素
    2.  父元素没有 padding-top 值
    3.  父元素没有 border-top 值
    4.  父元素和第一个子元素之间没有 inline 元素分隔

## rem 和 em

`rem`根据网页根元素的字体大小来计算。
`em`根据父元素的字体大小来计算。
浏览器字体默认大小是 16px。

## viewport

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

## 例题

### visibility: hidden 和 display: none 的区别

- 普通回答，一个隐藏，但占据位置，一个隐藏，不占据位置
- 进一步，`display`由于隐藏后不占据位置，所以造成了 dom 树的改变，会引发回流，代价较大
- 再进一步，当一个页面某个元素经常需要切换`display`时如何优化，一般会用复合层优化，或者要求低一点用`absolute`让其脱离普通文档流也行。然后可以将话题引到普通文档流，`absolute`文档流，复合图层的区别，
- 再进一步可以描述下浏览器渲染原理以及复合图层和普通图层的绘制区别（复合图层单独分配资源，独立绘制，性能提升，但是不能过多，还有隐式合成等等）

### 垂直水平居中

- 行内元素

```css
#container {
  text-align: center;
}
```

- 块状元素

```css
#center {
  margin: 0 auto;
}
```

- 已知宽高元素

1. 绝对定位与负边距

```css
#container {
  position: relative;
}
#center {
  width: 100px;
  height: 100px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -50px 0 0 -50px;
}
```

2. 绝对定位与 margin

```css
#container {
  position: relative;
}
#center {
  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
```

- 未知宽高元素

1.  居中元素是 inline 或 inline-block 元素时。

```css
#container {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}
#center {
}
```

2.  transform 法

```css
#container {
  position: relative;
}
#center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

3.  flex

```css
#container {
  display: flex;
  justify-content: center;
  align-items: center;
}

#center {
}
```
