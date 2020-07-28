// （1）什么是前端路由？

// 前端路由就是把不同路由对应不同的内容或页面的任务交给前端来做，之前是通过服务端根据url的不同返回不同的页面实现的。

// （2）什么时候使用前端路由？

// 在单页面应用，大部分页面结构不变，只改变部分内容的使用

// （3）前端路由有什么优点和缺点？

// 优点：用户体验好，不需要每次都从服务器全部获取，快速展现给用户

// 缺点：单页面无法记住之前滚动的位置，无法在前进，后退的时候记住滚动的位置

// 前端路由一共有两种实现方式，一种是通过 hash 的方式，一种是通过使用 pushState 的方式。

//hash
// class Routers {
//   constructor() {
//     //以键值对的形式存储路由
//     this.routes = {};
//     //当前路由url
//     this.currentUrl = '';
//     this.refresh = this.refresh.bind(this);
//     window.addEventListener('load', this.refresh, false);
//     window.addEventListener('hashchange', this.refresh, false);
//   }
//   //将路由的hash以及对应的cb函数存储
//   //触发路由hash变化后，执行对应的cb函数
//   route(path, cb) {
//     this.routes[path] = cb || function () {};
//   }
//   refresh() {
//     console.log(location.hash)
//     this.currentUrl = location.hash.slice(1) || '/';
//     this.routes[this.currentUrl]();
//   }
// }

// window.Router = new Routers();
// let content = document.querySelector('body');

// function changeBgColor(color) {
//   content.style.backgroundColor = color;
// }
// Router.route('/', function () {
//   changeBgColor('yellow');
// });
// Router.route('/blue', function () {
//   changeBgColor('blue');
// });
// Router.route('/green', function () {
//   changeBgColor('green');
// });

//history
class Routers {
  constructor() {
    this.routes = {};
    //在初始化时监听popstate事件
    this._bindPopState();
  }
  //初始化路由
  init(path) {
    history.replaceState({
      path: path
    }, null, path);
    this.routes[path] && this.routes[path]();
  }
  //将路径和对应回调函数加入hashMap储存
  route(path, cb) {
    this.routes[path] = cb || function () {};
  }
  //触发路由对应回调
  go(path) {
    history.pushState({
      path: path
    }, null, path);
    this.routes[path] && this.routes[path]();
  }
  //监听popState事件
  _bindPopState() {
    window.addEventListener('popstate', e => {
      const path = e.state && e.state.path;
      this.routes[path] && this.routes[path]();
    })
  }
}
window.Router = new Routers();
Router.init(location.pathname);
const content = document.querySelector('body');
const ul = document.querySelector('ul');

function changeBgColor(color) {
  content.style.backgroundColor = color;
}

Router.route('/', function () {
  changeBgColor('yellow');
});
Router.route('/blue', function () {
  changeBgColor('blue');
});
Router.route('/green', function () {
  changeBgColor('green');
});

ul.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    e.preventDefault();
    Router.go(e.target.getAttribute('href'));
  }
});