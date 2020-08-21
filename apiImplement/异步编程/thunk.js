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