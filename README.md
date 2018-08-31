# REACT 技术分享

------

`React` 是一个用于构建用户界面的 `JAVASCRIPT` 库。
`React` 主要用于构建UI，很多人认为 `React` 是 MVC 中的 V（视图）。
`React` 起源于 Facebook 的内部项目，用来架设 Instagram 的网站，并于 2013 年 5 月开源。
`React` 拥有较高的性能，代码逻辑非常简单，越来越多的人已开始关注和使用它。 


## React 特点

> * **声明式设计** − `React` 采用声明范式，可以轻松描述应用。
> * **高效** − `React` 采用声明范式，可以轻松描述应用。
> * **灵活** − `React` 可以与已知的库或框架很好地配合。
> * **JSX** −  `JSX` 是 `JavaScript` 语法的扩展。`React` 开发不一定使用 `JSX` ，但我们建议使用它。
> * **组件** − 通过 `React` 构建组件，使得代码更加容易得到复用，能够很好的应用在大项目的开发中。
> * **单向响应的数据流** − `React` 实现了单向响应的数据流，从而减少了重复代码，这也是它为什么比传统数据绑定更简单。

---

# REACT 安装

`React` 可以直接下载使用，下载包中也提供了很多学习的实例。
本教程使用了 `React` 的版本为 16.4.0，你可以在官网 https://reactjs.org/ 下载最新版。

你也可以直接使用 BootCDN 的 React CDN 库，地址如下：
```html
<script src="https://cdn.bootcss.com/react/16.4.0/umd/react.development.js"></script>
<script src="https://cdn.bootcss.com/react-dom/16.4.0/umd/react-dom.development.js"></script>
<!-- 生产环境中不建议使用 -->
<script src="https://cdn.bootcss.com/babel-standalone/6.26.0/babel.min.js"></script>
```

## 通过 npm 使用 React

确认已经安装了最新版本的 `Node.js` 及 `NPM` 。
我们建议在 `React` 中使用 `CommonJS` 模块系统，比如 `browserify` 或 `webpack`，本教程使用 `webpack`。

## 使用 create-react-app 快速构建 React 开发环境

我们需要在命令行中安装 `create-react-app` 工具，你可能还需要安装 `yarn` 。

    npm install -g create-react-app yarn
    
然后新建一个项目。
    
    create-react-app myApp
    
工具会自动初始化一个脚手架并安装 `React` 项目的各种必要依赖，如果在过程中出现网络问题，请尝试配置代理或使用其他 `npm registry`。
然后我们进入项目并启动。

    cd myApp
    yarn start

在浏览器中打开 http://localhost:3000/ ，看到 Welcome to React 的界面就算成功了。

---

# 实战分享

前面介绍了一些 `React` 的特点和安装方法，基础教程网上有很多很多，可以去随便找个认真的看一遍就差不多了。下面是实际的应用过程中的一些积累。

## yarn 简单用法

`yarn` 是一个快速、可靠、安全的依赖管理工具。

添加依赖包

    yarn add [package]
    yarn add [package]@[version]
    yarn add [package]@[tag]
    
升级依赖包

    yarn add [package]
    yarn add [package]@[version]
    yarn upgrade [package]@[tag]
    
移除依赖包

    yarn remove [package]
    
安装项目的全部依赖

    yarn 
    
或者

    yarn install
    
## 使用 react-router-dom 实现页面跳转

使用 `yarn` 添加依赖包

    yarn add react-router-dom
    
基本用法的代码如下：

``` js
import React, { Component } from 'react'
import {
  HashRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Login from './containers/Login'
import Index from './containers/Index'

class App extends Component {
  constructor(props) {  
    super(props);  
  }

  render() {
    return (
      <Router>
        <div>
          <ul>
            <li><Link to='/'>首页</Link></li>
            <li><Link to='/login'>登陆</Link></li>
          </ul>
          <hr/>
          <Switch>
            <Route path='/login' component={Login}/>
            <Route exact path='/' component={Index}/>
          </Switch>
        </div>
      </Router>
    )
  }
}
export default App

```

## Window sessionStorage 属性

localStorage 和 sessionStorage 属性允许在浏览器中存储 key/value 对的数据。<Br>sessionStorage 用于临时保存同一窗口(或标签页)的数据，在关闭窗口或标签页之后将会删除这些数据。<Br>**提示**: 如果你想在浏览器窗口关闭后还保留数据，可以使用 localStorage 属性， 改数据对象没有过期时间，今天、下周、明年都能用，除非你手动去删除。<Br>

### 语法
 
    window.sessionStorage

保存数据:

    sessionStorage.setItem("key", "value");

读取数据:

    sessionStorage.getItem("key");

删除指定键的数据:

    sessionStorage.removeItem("key");

删除所有数据:

    sessionStorage.clear();



## fetch 封装

`fetch` 用来异步加载数据，可以写一个 request.js 的文件来封装下，代码：

``` js
export default function request (method, url, body) {
  method = method.toUpperCase();
  if (method === 'GET') {
    // fetch的GET不允许有body，参数只能放在url中
    body = undefined;
  } else {
    body = body && JSON.stringify(body);
  }
  return fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      //'Access-Token': sessionStorage.getItem('access_token') || '' // 从sessionStorage中获取access token
	  Authorization: sessionStorage.Authorization  || ''
    },
    body
  })
  .then((res) => {
    if (res.status === 401) {
	  window.location.href = '#/login';
      return Promise.reject('Unauthorized.');
    } else {
      return res.json();
    }
  });
}

export const get = (url) => request('GET', url);
export const post = (url, body) => request('POST', url, body);
export const put = (url, body) => request('PUT', url, body);
export const del = (url, body) => request('DELETE', url, body);
```

需要使用的时候
```js
improt {get} from './request';

let url = '';//api接口的地址
get(url).then(res => {
  console.log(res);
})
```

## 高阶组件

高阶组件就是一个函数，传给它一个组件，它返回一个新的组件。可以避免大量重复的逻辑；

简单的高阶组件例子，代码：

```js
import React, { Component } from 'react'
import PropTypes from 'prop-types'

export HComponent = (OriginalComponent) => {
  class NewComponent extends Component {


    // 一些通用的操作

    render () {
      return <OriginalComponent />
    }
  }

  return NewComponent
}
```

使用：

```js
import React, { Component } from 'react'
import { HComponent } from './HComponent'

class Page extends Component {
  render () {
    return (
      <div>page</div>
    )
  }
}
Page = HComponent(Page);

export default Page
```
