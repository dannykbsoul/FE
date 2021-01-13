function ajax(options) {
  let method = options.method || 'GET',
      params = options.params,
      data = options.data,
      url = options.url + (params ? '?' + Object.keys(params).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key])).join('&') : ''),
      async = options.async,
          success = options.success,
          headers = options.headers,
          xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

  xhr.open(method, url, async);
  if (headers) Object.keys(headers).forEach(key => xhr.setRequestHeader(key, headers[key]));
  method === 'GET' ? xhr.send() : xhr.send(data);

  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) success && success(xhr.responseText);
  }
}

const ajax = options => {
  return new Promise((resolve, reject) => {
      let method = options.method || 'GET',
          params = options.params,
          data = options.data,
          url = options.url + (params ? '?' + Object.keys(params).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key])).join('&') : ''),
          async = options.async,
              headers = options.headers,
              xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

      xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
              if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                  resolve(xhr.responseText);
              }
          }
      }
      xhr.open(method, url, async);
      if (headers) Object.keys(headers).forEach(key => xhr.setRequestHeader(key, headers[key]));
      method === 'GET' ? xhr.send() : xhr.send(data);
  })
}

//iterator原理
function Iterator(array) {
  let nextIndex = 0;
  return {
      next() {
          return nextIndex < array.length ? {
              value: array[nextIndex++],
              done: false
          } : {
              value: undefined,
              done: true
          };
      }
  }
}
let iter = Iterator([1, 2, 3, 4]);
console.log(iter.next())
console.log(iter.next())
console.log(iter.next())
console.log(iter.next())
console.log(iter.next())

// 遍历器版本的generator
let arr = [1, [
      [2, 3], 4
  ],
  [5, 6]
];
let flat = function* (a) {
  let length = a.length;
  for (let i = 0; i < length; i++) {
      let item = a[i];
      if (Array.isArray(item)) {
          yield* flat(item);
      } else {
          yield item;
      }
  }
};
for (let f of flat(arr)) {
  console.log(f);
}

//Thunk方法主要使用在有cb(回调函数)参数的方法中，是指将参数拆分为cb部分和非cb部分
var Thunk = function (fn) {
  return function (...args) {
      return function (callback) {
          return fn.call(this, ...args, callback);
      }
  };
};

function f(a, cb) {
  cb(a);
}
let ft = Thunk(f);
let log = console.log.bind(console);
ft(1)(log); // 1


// Thunkify模块
// 生产环境的转换器，建议使用Thunkify模块
// npm install thunkify
function thunkify(fn) {
  return function () {
      var args = new Array(arguments.length);
      var ctx = this;
      for (var i = 0; i < args.length; ++i) {
          args[i] = arguments[i];
      }
      return function (done) {
          var called;
          args.push(function () {
              if (called) return;
              called = true;
              done.apply(null, arguments);
          });
          try {
              fn.apply(ctx, args);
          } catch (err) {
              done(err);
          }
      }
  }
};

function f(a, b, callback) {
  var sum = a + b;
  callback(sum);
  callback(sum);
}
var ft = thunkify(f);
var print = console.log.bind(console);
ft(1, 2)(print);


/**
* async的执行原理
* 其实就是自动执行generator函数
* 暂时不考虑genertor的编译步骤（更复杂）
*/

const getData = () =>
  new Promise(resolve => setTimeout(() => resolve("data"), 1000))

// 这样的一个async函数 应该再1秒后打印data
async function test() {
  const data = await getData()
  console.log('data: ', data);
  const data2 = await getData()
  console.log('data2: ', data2);
  const data3 = await getData()
  console.log('data3: ', data3);
  const data4 = await getData()
  console.log('data4: ', data4);
  const data5 = await getData()
  console.log('data5: ', data5);
  return 'success'
}

// async函数会被编译成generator函数 (babel会编译成更本质的形态，这里我们直接用generator)
function* testG() {
  // await被编译成了yield
  const data = yield getData()
  console.log('data: ', data);
  const data2 = yield getData()
  console.log('data2: ', data2);
  const data3 = yield getData()
  console.log('data3: ', data3);
  const data4 = yield getData()
  console.log('data4: ', data4);
  const data5 = yield getData()
  console.log('data5: ', data5);
  return 'success'
}

function spawn(genF) {
  // 先调用generator函数 生成迭代器
  // 对应 const gen = testG()
  // 返回一个promise 因为外部是用.then的方式 或者await的方式去使用这个函数的返回值的
  // let test = asyncToGenerator(testG)
  // test().then(res => console.log(res))
  return new Promise((resolve, reject) => {
      const gen = genF();
      // 内部定义一个step函数 用来一步一步的跨过yield的阻碍
      // key有next和throw两种取值，分别对应了gen的next和throw方法
      // arg参数则是用来把promise resolve出来的值交给下一个yield
      function step(key, arg) {
          let res;
          // 这个方法需要包裹在try catch中
          // 如果报错了 就把promise给reject掉 外部通过.catch可以获取到错误
          try {
              res = gen[key](arg);
          } catch (e) {
              return reject(e);
          }
          // gen.next() 得到的结果是一个 { value, done } 的结构
          const {
              value,
              done
          } = res;
          if (done) {
              // 如果已经完成了 就直接resolve这个promise
              // 这个done是在最后一次调用next后才会为true
              // 以本文的例子来说 此时的结果是 { done: true, value: 'success' }
              // 这个value也就是generator函数最后的返回值
              return resolve(value);
          } else {
              // 除了最后结束的时候外，每次调用gen.next()
              // 其实是返回 { value: Promise, done: false } 的结构，
              // 这里要注意的是Promise.resolve可以接受一个promise为参数
              // 并且这个promise参数被resolve的时候，这个then才会被调用
              return Promise.resolve(
                  // 这个value对应的是yield后面的promise
                  value
              ).then(
                  // value这个promise被resolve的时候，就会执行next
                  // 并且只要done不是true的时候 就会递归的往下解开promise
                  // 对应gen.next().value.then(value => {
                  //    gen.next(value).value.then(value2 => {
                  //       gen.next() 
                  //
                  //      // 此时done为true了 整个promise被resolve了 
                  //      // 最外部的test().then(res => console.log(res))的then就开始执行了
                  //    })
                  // })
                  (val) => {
                      step("next", val);
                  },
                  // 如果promise被reject了 就再次进入step函数
                  // 不同的是，这次的try catch中调用的是gen.throw(err)
                  // 那么自然就被catch到 然后把promise给reject掉啦
                  (e) => {
                      step("throw", e);
                  },
              )
          }
      }
      step("next");
  })
}

spawn(testG).then(result => {
  console.log(result)
})

class Promise {
  constructor(executor) {
      this.state = 'pending';
      this.value = undefined;
      this.reason = undefined;
      this.onResolvedCallbacks = [];
      this.onRejectedCallbacks = [];
      let resolve = (value) => {
          if (this.state === 'pending') {
              this.state = 'fulfilled';
              this.value = value;
              this.onResolvedCallbacks.forEach(fn => fn());
          }
      }
      let reject = (reason) => {
          if (this.state === 'pending') {
              this.state = 'rejected';
              this.reason = reason;
              this.onRejectedCallbacks.forEach(fn => fn());
          }
      }
      try {
          executor(resolve, reject);
      } catch (e) {
          reject(e);
      }
  }
  then(onFulfilled, onRejected) {
      onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
      onRejected = typeof onRejected === 'function' ? onRejected : err => {
          throw err
      };
      let promise2 = new Promise((resolve, reject) => {
          if (this.state === 'fulfilled') {
              setTimeout(() => {
                  try {
                      let x = onFulfilled(this.value);
                      resolvePromise(promise2, x, resolve, reject);
                  } catch (e) {
                      reject(e);
                  }
              }, 0)
          }
          if (this.state === 'rejected') {
              setTimeout(() => {
                  try {
                      let x = onRejected(this.reason);
                      resolvePromise(promise2, x, resolve, reject);
                  } catch (e) {
                      reject(e);
                  }
              }, 0)
          }
          if (this.state === 'pending') {
              this.onResolvedCallbacks.push(() => {
                  setTimeout(() => {
                      try {
                          let x = onFulfilled(this.value);
                          resolvePromise(promise2, x, resolve, reject);
                      } catch (e) {
                          reject(e);
                      }
                  }, 0)
              })
              this.onRejectedCallbacks.push(() => {
                  setTimeout(() => {
                      try {
                          let x = onRejected(this.reason);
                          resolvePromise(promise2, x, resolve, reject);
                      } catch (e) {
                          reject(e);
                      }
                  }, 0)
              })
          }
      })
      return promise2;
  }
  catch (fn) {
      return this.then(null, fn);
  }
  done(onFulfilled, onRejected) {
      this.then(onFulfilled, onRejected)
          .catch(function (reason) {
              //抛出一个全局错误
              setTimeout(() => {
                  throw reason;
              }, 0)
          })
  }
  finally(cb) {
      this.then(value => {
          return Promise.resolve(cb()).then(() => {
              return value;
          })
      }, error => {
          return Promise.resolve(cb()).then(() => {
              throw error;
          })
      })
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (x === promise2) reject(new TypeError());
  let called;
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
      try {
          let then = x.then;
          if (typeof then === 'function') {
              then.call(x, y => {
                  // ?为啥这地方要加called
                  if (called) return;
                  called = true;
                  resolvePromise(promise2, y, resolve, reject);
              }, e => {
                  if (called) return;
                  called = true;
                  reject(e);
              })
          } else {
              resolve(x);
          }
      } catch (e) {
          if (called) return;
          called = true;
          reject(e);
      }
  } else {
      resolve(x);
  }
}

Promise.resolve = function (val) {
  if (val instanceof Promise) return val;
  return new Promise((resolve, reject) => {
      if (val && val.then && typeof val.then === 'function') {
          //？
          val.then(resolve, reject);
      }
      resolve(val);
  })
}

Promise.reject = function (val) {
  return new Promise((resolve, reject) => {
      reject(val);
  })
}

Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
      for (let i = 0, len = promises.length; i < len; i++) {
          Promise.resolve(promises[i]).then(resolve, reject);
      }
  })
}

Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
      let resArr = [],
          count = 0,
          len = promises.length;

      for (let i = 0; i < len; i++) {
          Promise.resolve(promises[i]).then(val => {
              resArr[i] = val;
              count++;
              if (count === len) return resolve(resArr);
          }, e => {
              reject(e);
          })
      }
  })
}

Promise.defer = Promise.deferred = function () {
  let dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
      dfd.resolve = resolve
      dfd.reject = reject
  })
  return dfd
}

module.exports = Promise;

//promises-aplus-tests promise.js

// setTimeout(function () {
//   //...需要执行的操作
//   setTimeout(arguments.callee, 500)
// }, 500)

//如何改变让下面这个每隔1s输出
// for (var i = 0; i < 3; i++) {
//   setTimeout(function () {
//     console.log(i);
//   }, 1000 * i)
// }
//1.let
// for (let i = 0; i < 3; i++) {
//   setTimeout(function () {
//     console.log(i);
//   }, 1000 * i)
// }
//2.立即执行函数
// for (var i = 0; i < 3; i++) {
//   (function (index) {
//     setTimeout(function () {
//       console.log(index);
//     }, 1000 * index);
//   })(i)
// }
//3.setTimeout的第三个参数
//第三个参数可以给setTimeout的fn传参
// for (var i = 0; i < 3; i++) {
//   setTimeout(function (index) {
//     console.log(index);
//   }, 1000 * i, i)
// }

//实现一个倒计时的函数，setTimeout和setInterval分别实现
//1.let
function fn(num) {
  for (let i = num; i >= 0; i--) {
      setTimeout(function () {
          console.log(i);
      }, (num - i) * 1000)
  }
}
//2.立即执行函数(这样处理不太好，循环多少次，就形成了多少个不销毁的EC)
/*
* EC(自执行)
*   AO(自执行) 
*    i = 0~4
*   创建一个匿名函数_=>{...} BBBFFF000
*   BBBFFF000[[scope]]:AO(自执行)
* 
*   window.setTimeout(BBBFFF000，10);
* 相当于你外面引用了里面的变量，所以里面的执行上下文不会被销毁。
*/
function fn1(num) {
  for (var i = num; i >= 0; i--) {
      (function (i) {
          setTimeout(function () {
              console.log(i);
          }, (num - i) * 1000)
      })(i)
  }
}
//3.第三个参数
function fn3(num) {
  for (var i = num; i >= 0; i--) {
      setTimeout(function (index) {
          console.log(index);
      }, (num - i) * 1000, i);
  }
}

//一道使用promise实现红灯亮3s，绿灯2s，黄灯1s
function red() {
  console.log('red');
}

function green() {
  console.log('green');
}

function yellow() {
  console.log('yellow');
}

var light = function (timer, cb) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          cb();
          resolve();
      }, timer)
  })
}

var step = function () {
  Promise.resolve().then(function () {
      return light(3000, red);
  }).then(function () {
      return light(2000, green);
  }).then(function () {
      return light(1000, yellow);
  }).then(function () {
      step();
  });
}
//step();


//promisify
//我们需要将 callback 语法的 API 改造成 Promise 语法，为此我们需要一个 promisify 的方法。
//callback 方式: stat(path, (err, res) => .....)
//promise 方式: promisify(stat)(path).then(res => console.log(res))
function promisify(original) {
  //  promisify(stat) 这一步 return 下一行
  return function (...args) {
      //  将 original 函数接管，比如调用 promisify(stat)(path) 则 return 下一行的 promise
      return new Promise((resolve, reject) => {
          // 将 arguments 里面新增一个 original 的 callback，用来改变 promise 的状态
          args.push(function callback(err, ...values) {
              if (err) {
                  return reject(err);
              }
              return resolve(...values)
          });
          //  执行原函数(args 已经新增了 callback 了)
          original.call(this, ...args);
      });
  };
}

function ajax(url, success, fail) {
  var client = new XMLHttpRequest();
  client.open("GET", url);
  client.onreadystatechange = function() {
    if (this.readyState !== 4) {
      return;
    }
    if (this.status === 200) {
      success(this.response);
    } else {
      fail(new Error(this.statusText));
    }
  };
  client.send();
};
ajax('/ajax.json', function() {console.log('成功')}, function() {console.log('失败')});

const ajaxPromise=(url)=>{
  return new Promise((resolve,reject)=>{
    var client = new XMLHttpRequest();
    client.open("GET", url);
    client.onreadystatechange = function() {
      if (this.readyState !== 4) {
        return;
      }
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };
    client.send();
  })
}

function Parent() {
  this.actions = ['z','j'];
}
function Child() {}
Child.prototype = new Parent();
Child.prototype.constructor = Child;
var child1 = new Child();
var child2 = new Child();
child1.actions='nb';
console.log(child1.actions); // ['eat']
console.log(child2.actions); // ['eat']

