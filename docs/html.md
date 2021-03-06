<!-- TOC -->

- [HTML](#html)
  - [语义化](#语义化)
  - [解析模式](#解析模式)
  - [HTML5](#html5)
  - [标签](#标签)
  - [存储](#存储)
    - [localStorage 和 sessionStorage](#localstorage-和-sessionstorage)
    - [cookie](#cookie)
      - [cookie 安全性字段。](#cookie-安全性字段)
    - [cookie vs session](#cookie-vs-session)
    - [HTML5 离线缓存](#html5-离线缓存)
  - [多媒体](#多媒体)
    - [图片](#图片)
    - [音频和视频](#音频和视频)
  - [Load 和 DOMContentLoaded 区别](#load-和-domcontentloaded-区别)
  - [回流和重绘](#回流和重绘)
  - [iframe](#iframe)
    - [优点](#优点)
    - [缺点](#缺点)
    - [使用场景](#使用场景)
  - [Service Worker](#service-worker)

<!-- /TOC -->

# HTML

**HTML**的**文档源**：由**协议**、**主机名**（域名）和**端口**决定。

`window.onffline`当离线时触发；`window.ononline`当返回在线状态时触发。

## 语义化

语义化的含义就是用正确的标签做正确的事情，html 语义化就是让页面的内容结构化，便于对浏览器、搜索引擎解析；在没有样式 CCS 情况下也以一种文档格式显示，并且是容易阅读的。搜索引擎的爬虫依赖于标记来确定上下文和各个关键字的权重，利于 SEO。使阅读源代码的人对网站更容易将网站分块，便于阅读维护理解。

## 解析模式

在文件第一行，html 根元素之前，添加一个 doctype 来声明文档类型。

```html
<!DOCTYPE html>
```

1.  标准模式：遵循浏览器支持的最新 css 解析标准；
2.  怪异模式：尝试兼容更旧的浏览器
3.  近似标准模式：过渡模式，让浏览器尝试以新标准方式来处理对旧标准实现的代码；

HTML5 提供的<!DOCTYPE html>是标准模式，向后兼容的, 等同于开启了标准模式。

## HTML5

1.  新增标签
2.  新 API
    - HTML Geolocation
    - HTML Drag and Drop
    - HTML Local Storage
    - HTML Application Cache
    - HTML Web Workers
    - HTML SSE
    - HTML Canvas/WebGL
    - HTML Audio/Video

## 标签

`<pre>`标签会预定义格式化的文本，但会保留空格和换行符。`<code>`标签表示计算机源码

`<script>`标签打开`defer`或`async`属性，脚本就会异步加载。渲染引擎遇到这一行命令，就会开始下载外部脚本，但不会等它下载和执行，而是直接执行后面的命令。

`defer`与`async`的区别是

- `defer`要等到整个页面在内存中**正常渲染结束**（DOM 结构完全生成，以及其他脚本执行完成），才会执行。
- `async`一旦下载完，渲染引擎就会中断渲染，**执行这个脚本完后，再继续渲染**。
- 如果有多个`defer`脚本，会按照它们在页面出现的顺序加载，而多个`async`脚本是不能保证加载顺序的。

`async`和`defer`都指定时会按照`async`的方式执行，两个属性都指定是为了在 `async`不支持的时候启用`defer`，但`defer`在某些情况下还是有 bug。

## 存储

### localStorage 和 sessionStorage

**区别**：存储的**有效期**和**作用域**不同。

**localStorage**：浏览器内的**永久性存储**，除非用户或者 Web 应用删除；**同源**的可以共享读取或覆盖，非同源的无法读取或覆盖。

**sessionStorage**：存储在标签页或窗口内，一旦永久关闭就被删除。**同源且同窗口**可以共享，非同源或同源但非同窗口的不能共享。

**API**

```javascript
localStorage.setItem('x', 1)
localStorage.getItem('x')
localStorage.removeItem('x')
// 遍历
for (let i = localStorage.length - 1; i >= 0; i--) {
  console.log(`第${i + 1}条数据的键值为：${localStorage.key(i)}，数据为${localStorage.getItem(localStorage.key(i))}`)
}
```

**存储事件**

当 localStorage 或 sessionStorage 中的数据真正变化时，会在其他对该数据可见的窗口对象上触发存储事件（进行改变的窗口不会触发）

### cookie

HTTP 协议的一种拓展；在 Web 浏览器和 Web 服务器之间传输。服务端可以操作客户端的 cookie；

**有效期**：持续在 Web 浏览器会话期间，与 sessionStorage 不同，不会局限在窗口中，而与浏览器进程相关。可以设置**max-age**(s)来控制。

**作用域**：通过**文档源**和**文档路径**来确定，与创建它的 Web 页面有关，并对该页面可见。设置 path 和 domain 属性控制。

**HttpOnly**: 告知浏览器不允许 js 通过`document.cookie`去更改这个值，同样这个值在 document.cookie 中也不可见。但在 http 请求仍然会携带这个 cookie。
注意这个值虽然在脚本中不可获取，但仍然在浏览器安装目录中以文件形式存在。这项设置通常在服务器端设置。

**secure**：设置为 true 时，只能通过 HTTPS 等安全协议来传输。

#### cookie 安全性字段。

|   属性    |                              作用                              |
| :-------: | :------------------------------------------------------------: |
|   value   | 如果用于保存用户登录态，应该将该值加密，不能使用明文的用户标识 |
| http-only |             不能通过 JS 访问 Cookie，减少 XSS 攻击             |
|  secure   |                只能在协议为 HTTPS 的请求中携带                 |
| same-site |     规定浏览器不能在跨域请求中携带 Cookie，减少 CSRF 攻击      |

```javascript
document.cookie = 'version=aaa;path=path;domain=domain;secure;max-age=64000'
```

**局限性**：旧浏览器保存不能超过 300 个，Web 服务器不能超过 20 个，每个 cookie 不能超过 4KB；

### cookie vs session

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

### HTML5 离线缓存

**应用程序缓存**与一般的浏览器缓存不同，不会随着浏览器缓存清除而被清除，也不会被最近访问的数据替代。

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

## 多媒体

### 图片

通过`document.images`可以遍历网页上的图片

### 音频和视频

通过`<source>`元素来指定不同格式的媒体源

```html
<audio id="music">
	<source src="music.mp3" type="audio/mpeg">
	<source src="music.ogg" type='audio/ogg;codec="vorbis"'>
</audio>
```

## Load 和 DOMContentLoaded 区别

`Load`事件触发代表页面中的 DOM，CSS，JS，图片已经全部加载完毕。

`DOMContentLoaded`事件触发代表初始的 HTML 被完全加载和解析，不需要等待 CSS，JS，图片加载。

## 回流和重绘

Layout，也称为 Reflow，即回流。一般意味着元素的内容、结构、位置或尺寸发生了变化，需要重新计算样式和渲染树。

Repaint，即重绘，意味着元素发生的改变只是影响了元素的一些外观之类的时候（例如，背景色，边框颜色，文字颜色等），此时只需要应用新样式绘制这个元素就可以了。

**什么时候引起回流**

1. 页面渲染初始化
2. DOM 结构改变，比如删除了某个节点,设置元素的**内联样式**或 **css**
3. render 树变化，比如减少了 padding，字体改变
4. 窗口 resize
5. 最复杂的一种：获取某些属性，引发回流如`getComputedStyle()`

很多浏览器会对回流做优化，会等到数量足够时做一次批处理回流，除了 render 树的直接变化，当获取一些属性时，浏览器为了获得正确的值也会触发回流，这样使得浏览器优化无效，包括

- offset(Top/Left/Width/Height)
- scroll(Top/Left/Width/Height)
- cilent(Top/Left/Width/Height)
- width,height
- 调用了 getComputedStyle()或者 IE 的 currentStyle

**优化方案**

- 减少逐项更改样式，最好一次性更改 style，或者将样式定义为 class 并一次性更新
- 避免循环操作 dom，创建一个 documentFragment 或 div，在它上面应用所有 DOM 操作，最后再把它添加到 window.document
- 避免多次读取 offset 等属性。无法避免则将它们缓存到变量
- 将复杂的元素绝对定位或固定定位，使得它脱离文档流，否则回流代价会很高
- 实现动画时，最好应用在 position 为 fixed 或 absolute 的元素上
- 避免同时设置多个元素的内联样式（style 属性）
- 避免使用 table 布局
- 不要使用 CSS JavaScript 表达式（例如：color: expression((new Date()).getHours()%2 ? “#0091ea” : “#00b8d4” )

## iframe

### 优点

1.  页面与程序分离
2.  调用静态页面方便
3.  展示嵌入页面
4.  重载页面不容易重载整个页面

### 缺点

1.  iframe 会增加 http 请求
2.  子页面不容易管理
3.  浏览器后退前进失效
4.  seo 不友好
5.  不兼容移动设备

### 使用场景

1.  沙箱隔离
2.  引用第三方内容
3.  独立带交互的内容
4.  保持独立焦点和历史记录的子窗口

## Service Worker

- 它是一种 JavaScript 工作线程，无法直接访问 DOM。 服务工作线程通过响应 postMessage 接口发送的消息来与其控制的页面通信，页面可在必要时对 DOM 执行操作。
- 服务工作线程是一种可编程网络代理，让您能够控制页面所发送网络请求的处理方式。
- 它在不用时会被中止，并在下次有需要时重启，因此，您不能依赖于服务工作线程的 onfetch 和 onmessage 处理程序中的全局状态。如果存在您需要持续保存并在重启后加以重用的信息，服务工作线程可以访问 IndexedDB API。
- 服务工作线程广泛地利用了 promise

目前，`service worker`用来制作缓存文件，提高首屏速度。

```javascript
// index.js
if (navigator.serviceWorker) {
  navigator.serviceWorker
    .register('sw.js')
    .then(function(registration) {
      console.log('service worker 注册成功')
    })
    .catch(function(err) {
      console.log('servcie worker 注册失败')
    })
}
// sw.js
// 监听 `install` 事件，回调中缓存所需文件
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('my-cache').then(function(cache) {
      return cache.addAll(['./index.html', './index.js'])
    })
  )
})

// 拦截所有请求事件
// 如果缓存中已经有请求的数据就直接用缓存，否则去请求数据
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      if (response) {
        return response
      }
      console.log('fetch source')
    })
  )
})
```
