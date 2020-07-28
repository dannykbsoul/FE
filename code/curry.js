function curry(fn, args) {
  let length = fn.length;
  args = args || [];
  return function () {
    let _args = [...args].concat([...arguments]);
    if (_args.length < length) return curry.call(this, fn, _args);
    else return fn.apply(this, _args);
  }
}

// currying 函数柯理化 部分求值
let currying = function (fn, args) {
  args = args || [];
  return function () {
    if (arguments.length === 0) {
      return fn.apply(this, args);
    }
    return currying.call(this, fn, args.concat(...arguments));
  }
}
let count = currying(function (...rest) {
  return rest.reduce((prev, cur) => prev + cur, 0);
});

console.log(count(100)(200)(10)()); // 310

//收集参数 延迟执行 到达指定次数才执行
function fn(...rest) {
  console.log(rest);
};

function after(fn, time = 1) {
  let params = [];
  return function (...rest) {
    params = [...params, ...rest];
    if (--time === 0) {
      fn.apply(this, params);
    }
  }
}
let newFn = after(fn, 3); // 执行3次 内部fn才会执行
newFn(2, 6, 7);
newFn(3);
newFn(4);


// 第二版
let _ = {};

function partial(fn) {
  let args = [].slice.call(arguments, 1);
  return function () {
    let position = 0,
      _args = [];
    for (let i = 0, len = args.length; i < len; i++) {
      _args.push(args[i] === _ ? arguments[position++] : args[i]);
    }
    while (position < arguments.length) _args.push(arguments[position++]);
    return fn.apply(this, _args);
  };
};
let subtract = function (a, b) {
  return b - a;
};
subFrom20 = partial(subtract, _, 20);
console.log(subFrom20(5));
console.log(subFrom20(4));


// 实现一个add方法，使计算结果能够满足如下预期：
// add(1)(2)(3)
// add(1, 2, 3)(4)
// add(1)(2)(3)(4)(5)

function add() {
  // 第一次执行时，定义一个数组专门用来存储所有的参数
  var _args = Array.prototype.slice.call(arguments);

  // 在内部声明一个函数，利用闭包的特性保存_args并收集所有的参数值
  var _adder = function () {
    _args.push(...arguments);
    return _adder;
  };

  // 利用toString隐式转换的特性，当最后执行时隐式转换，并计算最终的值返回
  _adder.toString = function () {
    return _args.reduce(function (a, b) {
      return a + b;
    });
  }
  return _adder;
}

console.log(add(1)(2)(3)) // 6
console.log(add(1, 2, 3)(4)) // 10
console.log(add(1)(2)(3)(4)(5)) // 15
console.log(add(2, 6)(1)) // 9