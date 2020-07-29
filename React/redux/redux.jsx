/**
 * redux简介：
 * 1.redux诞生是为了给React应用提供可预测化的状态管理机制
 * 2.redux会将整个应用状态存储到一个地方，称为store
 * 3.store里面保存一颗状态树(state tree)
 * 4.组件改变state的唯一方法是通过调用store的dispatch，触发一个action，这个action被对应的reducer处理，然后state完成更新
 * 5.其它组件可以通过订阅store中的状态(state)来更新自己的视图
 */

/**
 * 使用步骤:
 * 1.创建reducer reducer接收state和action，根据action来更新state
 * 2.创建action 是一个对象，必须有type属性来定义action类型
 * 3.使用createStore方法创建store，store提供subscribe、dispatch、getState等方法
 */

/**
 * react首先想要改变store数据，先要去派发一个action，
 * action通过dispatch方法传递给store，store再把这个之前的数据和action转发给reducer，r
 * educer是一个函数，接收到了state和action之后，经过一些处理返回一个新的state给store，
 * store用这个新的state替换掉之前的state，store数据发生变化的时候，由于我们在组件中subscribe了
 * 这个store的变化，所以会执行subscribe这个方法，这个方法会去store重新取数据，更新组件的内容，页面也就发生变化了。
 */

/**
 *store目录下放的是redux内容:
 *1.index.js是创建store的地方
 *2.reducer.js是定义处理state的地方，导出的是一个纯函数，函数接收两个参数state和action，并且返回一个处理过的state
 *3.actionTypes.js是放action type的地方，主要是为了防止由于写错type而导致的bug，并且这个bug一旦出现很难发现。
 *  因为将字符串提取成变量名，变量名一旦写错，报错很明显，而字符串写错，无任何报错
 *4.actionCreators.js是创建action的地方，导出若干方法，方法执行得到action对象，再在index.js中dispatch
 */

/**
 *
 *1.store是唯一的
 *2.只有store能够改变自己的内容，store将state和action传递给reducer，
 *  然后reducer返回一个新的state的给store，然后store自己改变自己的数据，
 *  这时候我们的组件订阅了store的变化，当store发生了变化，执行subscribe里传入的函数，
 *  此时这个函数中执行setState，更新组件数据，从而数据驱动视图更新。
 *3.reducer是纯函数，纯函数指的是给定固定的输入，就一定会有固定的输出，而且不会有副作用
 *  比如说你对接收的state进行的修改，这就是一种副作用
 *
 *还可以使用redux做临时存储：
 *页面加载的时候，把从服务器获取的数据信息存储到redux中，组件渲染需要的数据从redux中获取，
 *这样只要页面不刷新，路由切换的时候，再次渲染组件不需要重新从服务器拉取数据，直接从redux中获取即可；
 *页面刷新，从头开始！（这套方案代替了localStorge本地存储来实现数据缓存）
 */

/**
 *
 * @param {*} reducer
 * @return
 * store:{dispatch,getState,subscribe}
 */
function createStore(reducer) {
  //创建一个store，state用来存储管理的状态信息
  let state,
    //在组件内部subscribe的时候添加的事件回调
    listenArr = [];

  function dispatch(action) {
    state = reducer(state, action);
    for (let i = 0, len = listenArr.length; i < len; i++) {
      let listen = listenArr[i];
      if (typeof listen === "function") listen();
      else {
        listenArr.splice(i, 1);
        i--;
      }
    }
  }

  return {
    dispatch,
    getState,
    subscribe,
  };
}

function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}
