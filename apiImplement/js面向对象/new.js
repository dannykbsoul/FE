//new实现
function myNew(constructor, ...args) {
  if (typeof constructor !== 'function') {
    throw 'newOperator function the first param must be a function';
  }
  //1.创建一个对象，并让这个对象的原型指向构造函数的prototype
  let instance = Object.create(constructor.prototype);
  //2.将构造函数的this指向instance，并执行构造函数
  let result = constructor.apply(instance, args);
  return (typeof result === 'object' && result !== 'null') || typeof result === 'function' ? result : instance;
}

//Object.create()实现
function create(proto) {
  function F() {};
  F.prototype = proto;
  F.prototype.constructor = F;
  return new F();
}