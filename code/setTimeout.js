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