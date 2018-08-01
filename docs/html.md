## HTML

**HTML**的**文档源**：由**协议**、**主机名**（域名）和**端口**决定。

`window.onffline`当离线时触发,`window.ononline`当返回在线状态时触发。

### 标签

`<pre>`标签会预定义格式化的文本，但会保留空格和换行符。`<code>`标签表示计算机源码

### 存储

#### localStorage 和 sessionStorage

**区别**：存储的**有效期**和**作用域**不同。

**localStorage**：浏览器内的**永久性存储**，除非用户或者 Web 应用删除；**同源**的可以共享读取或覆盖，非同源的无法读取或覆盖。

**sessionStorage**：存储在标签页或窗口内，一旦永久关闭就被删除。**同源且同窗口**可以共享，非同源或同源但非同窗口的不能共享。

**API**

```javascript
localStorage.setItem('x', 1)
localStorage.getItem('x')
```

**存储事件**

当 localStorage 或 sessionStorage 中的数据真正变化时，会在其他对该数据可见的窗口对象上触发存储事件（进行改变的窗口不会触发）



#### cookie

HTTP 协议的一种拓展；在 Web 浏览器和 Web 服务器之间传输。服务端可以操作客户端的 cookie；

**有效期**：持续在 Web 浏览器会话期间，与 sessionStorage 不同，不会局限在窗口中，而与浏览器进程相关。可以设置**max-age**(s)来控制。

**作用域**：通过**文档源**和**文档路径**来确定，与创建它的 Web 页面有关，并对该页面可见。设置 path 和 domain 属性控制。

**HttpOnly**: 告知浏览器不允许通过脚本 document.cookie 去更改这个值，同样这个值在 document.cookie 中也不可见。但在 http 请求张仍然会携带这个 cookie。注意这个值虽然在脚本中不可获取，但仍然在浏览器安装目录中以文件形式存在。这项设置通常在服务器端设置。

**secure**：设置为 true 时，只能通过 HTTPS 等安全协议来传输。

```javascript
document.cookie = 'version=aaa;path=path;domain=domain;secure;max-age=64000'
```

**局限性**：旧浏览器保存不能超过 300 个，Web 服务器不能超过 20 个，每个 cookie 不能超过 4KB；

#### cookie vs session

cookie 存储于浏览器端，而 session 存储于服务端。

cookie 的安全性相比于 session 较弱，别人可以分析存放在本地的 COOKIE 并进行 COOKIE 欺骗，考虑到安全应当使用 session。

session 会在一定时间内保存在服务器上。当访问增多时，会占用服务器的资源，所以考虑到服务器性能方面，可以使用 cookie。

单个 cookie 保存数据不能超过 4k，且很多浏览器限制一个站点最多保存 20 个 cookie； session 默认大小一般是 1024k。

```
在登陆页面，用户登陆了

此时，服务端会生成一个session，session中有对于用户的信息（如用户名、密码等）

然后会有一个sessionid（相当于是服务端的这个session对应的key）

然后服务端在登录页面中写入cookie，值就是:jsessionid=xxx

然后浏览器本地就有这个cookie了，以后访问同域名下的页面时，自动带上cookie，自动检验，在有效时间内无需二次登陆。
```



#### HTML5 离线缓存

**应用程序缓存**与一般的浏览器缓存不同，：不会随着浏览器缓存清除而被清除，也不会被最近访问的数据替代。

通过 manifest 文件进行控制：在文件中定义那些需要缓存的文件；支持 manifest 的浏览器，会将按照 manifest 文件的规则，将资源保存在本地，从而在没有网络链接的情况下也能访问页面。

**流程**

当我们第一次正确配置 app cache 后，当我们再次访问该应用时，浏览器会首先检查 manifest 文件是否有变动，如果有变动就会把相应的变更进行资源下载，同时改变浏览器里面的 app cache，如果没有变动，就会直接把 app cache 的资源返回。

**API**

通过`window.applicationCache`相关 api 来控制。

```javascript
window.applicationCache.update() // 强制更新缓存
window.applicationCache.swapCache() // 弃用老的缓存，但不会重新载入已载入的html文件，图片等资源
```

**如何更新缓存**

更新 manifest 文件 / 通过 javascript 操作 / 清除浏览器缓存

**优点**

可以离线运行、可以减少资源请求、可以更新资源

**缺点**

- 更新的资源，需要二次刷新才会被页面采用；
- 不支持增量更新，只有 manifest 发生变化，所有资源全部重新下载一次，资源变化时不会更新
- 缺乏足够容错机制，当清单中任意资源文件出现加载异常，都会导致整个 manifest 策略运行异常



### 多媒体

#### 图片

通过`document.images`可以遍历网页上的图片

#### 音频和视频

通过`<source>`元素来指定不同格式的媒体源

```html
<audio id="music">
	<source src="music.mp3" type="audio/mpeg">
	<source src="music.ogg" type='audio/ogg;codec="vorbis"'>
</audio>
```

### 回流和重绘

Layout，也称为Reflow，即回流。

一般意味着元素的内容、结构、位置或尺寸发生了变化，需要重新计算样式和渲染树

Repaint，即重绘。

意味着元素发生的改变只是影响了元素的一些外观之类的时候（例如，背景色，边框颜色，文字颜色等），此时只需要应用新样式绘制这个元素就可以了

**什么时候引起回流**

```
1.页面渲染初始化
2.DOM结构改变，比如删除了某个节点
3.render树变化，比如减少了padding，字体改变
4.窗口resize
5.最复杂的一种：获取某些属性，引发回流，
很多浏览器会对回流做优化，会等到数量足够时做一次批处理回流，除了render树的直接变化，当获取一些属性时，浏览器为了获得正确的值也会触发回流，这样使得浏览器优化无效，包括
    （1）offset(Top/Left/Width/Height)
     (2) scroll(Top/Left/Width/Height)
     (3) cilent(Top/Left/Width/Height)
     (4) width,height
     (5) 调用了getComputedStyle()或者IE的currentStyle
```

**优化方案**

+ 减少逐项更改样式，最好一次性更改style，或者将样式定义为class并一次性更新
+ 避免循环操作dom，创建一个documentFragment或div，在它上面应用所有DOM操作，最后再把它添加到window.document
+ 避免多次读取offset等属性。无法避免则将它们缓存到变量
+ 将复杂的元素绝对定位或固定定位，使得它脱离文档流，否则回流代价会很高