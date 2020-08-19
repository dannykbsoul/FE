//call ES6
Function.prototype.MyCall = function (context, ...args) {
  // this指向调用call的对象
  if (typeof this !== 'function') {
    // 调用call的若不是函数则报错
    throw new TypeError('Error');
  }
  context = context || window;
  // 将调用call函数的对象添加到context的属性中
  context.fn = this;
  // 执行该属性
  let result = context.fn(...args);
  // 删除该属性
  delete context.fn;
  // 返回函数执行结果
  return result;
}

Function.prototype.MyCallSym = function (context, ...args) {
  context = context || window;
  let fn = Symbol();
  //使用Symbol防止覆盖context上的fn属性
  context[fn] = this;
  let res = context[fn](...args);
  Reflect.deleteProperty(context, fn);
  return res;
}

//apply
Function.prototype.MyApply = function (context, args) {
  context = context || window;
  context.fn = this;
  let res = context.fn(...args);
  delete context.fn;
  return res;
}

//bind
Function.prototype.MyBind = function (context, ...args) {
  if (typeof this !== "function") {
    throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
  }
  let self = this;
  let fBound = function (...amArg) {
    return self.call(this instanceof fBound ? this : context, args.concat(amArg));
  }
  fBound.prototype = Object.create(this.prototype);
  // let fNOP = function () {};
  // if (this.prototype) {
  //   fNOP.prototype = this.prototype;
  // }
  // fBound.prototype = new fNOP();
  return fBound;
}