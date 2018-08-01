## 盒子模型

模型：**W3C 盒子模型** 和 **IE 盒子模型**
范围：margin、border、padding、content
区别：IE 盒子模型的 content 部分包含了 border 和 padding
设置：`box-sizing`默认为`content-box`，一般设置为`border-box`

## 布局

### 盒内布局

### 盒间布局

#### 脱离正常流

1.  absolute 布局
2.  float 布局

#### 正常文档流

1.  BFC
2.  IFC
3.  FFC
4.  table
5.  grid

## 清除浮动

目的：清除因为浮动元素脱离正常流导致的高度塌陷。
方法:

1.  父元素定义`overflow:auto`
2.  插入新的元素，样式设置`clear:both`
3.  父元素添加伪类`:after`，并设置`clear:both`

### 外边距合并（margin_collapsing）

当两个垂直外边距相遇时，它们将形成一个外边距。合并后的外边距的高度等于两个发生合并的外边距的高度中的较大者。

### rem 和 em

`rem`根据网页根元素的字体大小来计算。
`em`根据父元素的字体大小来计算。
浏览器字体默认大小是 16px。


