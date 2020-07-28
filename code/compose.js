let fn1 = function (x) {
  return x + 10;
};
let fn2 = function (x) {
  return x * 10;
};
let fn3 = function (x) {
  return x / 10;
};

// function compose(...funcs) {
//   //=>funcs:传递的函数集合
//   return function proxy(...args) {
//     //=>args:第一次调用函数传递的参数集合
//     let len = funcs.length;
//     if (len === 0) {
//       //=>一个函数都不需要执行,直接返回ARGS
//       return args;
//     }
//     if (len === 1) {
//       //=>只需要执行一个函数，把函数执行，把其结果返回即可
//       return funcs[0](...args);
//     }
//     return funcs.reduce((x, y) => {
//       return typeof x === "function" ? y(x(...args)) : y(x);
//     });
//   };
// }

// function compose(...funcs) {
//   return function (...args) {
//     let len = funcs.length;
//     if (len === 0) return args;
//     if (len === 1) return funcs[0](...args);
//     return funcs.reduce((cur, pre) => {
//       return typeof cur === 'function' ? pre(cur(...args)) : pre(cur);
//     })
//   }
// }

// (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));

// function compose(...funcs) {
//   if (funcs.length === 0) {
//     return arg => arg
//   }

//   if (funcs.length === 1) {
//     return funcs[0]
//   }

//   return funcs.reduce((a, b) => (...args) => a(b(...args)))
// }
function compose(...funcs) {
  let start = funcs.length - 1;
  return function () {
    let i = start;
    let result = funcs[start].apply(this, arguments);
    while (i--) result = funcs[i].call(this, result);
    return result;
  };
};

// console.log(compose()(1));
console.log(compose(fn1, fn2)(2));