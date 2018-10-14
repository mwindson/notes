<!-- TOC -->

- [React-Router](#react-router)
  - [SPA 路由](#spa-路由)
  - [hash 路由](#hash-路由)
  - [history 路由](#history-路由)
  - [React-Router 原理](#react-router-原理)
  - [动态加载](#动态加载)

<!-- /TOC -->

# React-Router

## SPA 路由

SPA 弊端：

1.  用户在使用的过程中，url 不会发生任何改变。当用户操作了几步之后，一不小心刷新了页面，又会回到最开始的状态。
2.  由于缺乏 url，不方便搜索引擎进行收录。

## hash 路由

- hash 原来用于文档的导航，具有**改变 url 同时，不刷新页面**的特性。
- hash 路由通过操作`window.location`的字符串来更改 hash，通过`window.addEventListener('hashchange', callback)`来监听 URL 的变化。
- 基于 hash 路由的 url 存在一个#号，不美观。

```javascript
// 基于hash路由的实现
class Router {
  constructor() {
    this.routes = {}
    this.currentUrl = ''
  }
  route(path, callback) {
    this.routes[path] = callback || function() {}
  }
  updateView() {
    this.currentUrl = location.hash.slice(1) || '/'
    this.routes[this.currentUrl] && this.routes[this.currentUrl]()
  }
  init() {
    window.addEventListener('load', this.updateView.bind(this), false)
    window.addEventListener('hashchange', this.updateView.bind(this), false)
  }
}
const router = new Router()
router.init()
router.route('/', function() {
  document.getElementById('content').innerHTML = 'Home'
})
router.route('/about', function() {
  document.getElementById('content').innerHTML = 'About'
})
router.route('/topics', function() {
  document.getElementById('content').innerHTML = 'Topics'
})
```

## history 路由

- 基于 history 的路由，它通过`history.pushState`来修改 URL，通过`window.addEventListener('popstate', callback)`来监听前进/后退事件。
- 早期 history：`go`，`forward`，`back`，只能用于多页面跳转。
  HTML5 新增`pushState()`和`replaceState()`来实现改变 url 且不刷新页面。
- history 改变无法触发事件，因此需要**监听前进或后退按钮的点击或者 a 标签、js 修改路由**三个途径。HTML5 规范中新增了一个 onpopstate 事件，通过它便可以监听到前进或者后退按钮的点击。

![history路由](https://user-images.githubusercontent.com/8401872/29739490-c1dbb054-8a71-11e7-9c9f-31cbbd6adbcb.png)

```html
<body>
  <div class="content"></div>
  <a href='/' class='menu'>home</a>
  <a href='/profile' class='menu'>profile</a>
  <a href='/articles' class='menu'>articles</a>
</body>
```

```javascript
// 基于history的路由
const $ = selector => document.querySelector(selector)
class Route {
  constructor(routeMap) {
    this.routeMap = routeMap
    this._bindPopState()
  }
  init(path) {
    path = Route.correctPath(path)
    history.replaceState({ path }, '', path)
    this.routeMap[path] && this.routeMap[path]()
  }
  go(path) {
    path = Route.correctPath(path)
    history.pushState({ path }, '', path)
    this.routeMap[path] && this.routeMap[path]()
  }
  _bindPopState() {
    window.addEventListener('popstate', e => {
      const path = e.state && e.state.path
      this.routeMap[path] && this.routeMap[path]()
    })
  }
  static correctPath(path) {
    if (path !== '/' && path.slice(-1) === '/') {
      path = path.match(/(.+)\/$/)[1]
    }
    return path
  }
}
const routeMap = {
  '/': () => {
    const content = $('.content')
    content.innerHTML = '<div>welcome to Home Page</div>'
  },
  '/profile': () => {
    const content = $('.content')
    content.innerHTML = '<div>welcome to Profile Page</div>'
  },
  '/articles': () => {
    const content = $('.content')
    content.innerHTML =
      '<div>' +
      '<p>welcome to Article Page</p>' +
      '<ul>' +
      '<li>文章1</li>' +
      '<li>文章2</li>' +
      '<li>文章3</li>' +
      '</ul>' +
      '</div>'
  }
}
const router = new Route(routeMap)
router.init(location.pathname)
$('.menu').addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    e.preventDefault()
    router.go(e.target.getAttribute('href'))
  }
})
```

## React-Router 原理

React-Router 基于 history 库实现，实现了 URL 与渲染组件的同步。
history 库：

- 老浏览器的 history: 主要通过 hash 来实现，对应 createHashHistory
- 高版本浏览器: 通过 html5 里面的 history，对应 createBrowserHistory
- node 环境下: 主要存储在 memeory 里面，对应 createMemoryHistory

http://zhenhua-lee.github.io/react/history.html

state 存储在 sessionStorage 中

![img](http://zhenhua-lee.github.io/img/react-router/internal.png)
![img](http://zhenhua-lee.github.io/img/react-router/upper.png)

## 动态加载

访问到路由才加载对应的组件

- `getChildRoutes`
- `getIndexRoute`
- `getComponents`
