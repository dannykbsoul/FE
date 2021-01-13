// Symbol.hasInstance可以自定义instanceof的行为，所以说也不是很可靠
class PrimitiveString {
  static[Symbol.hasInstance](x) {
      return typeof x === 'string';
  }
}
console.log('hello world'
  instanceof PrimitiveString) // true

// 通过 “实例 instanceof 类”进行判断的时候，会通过执行 类[Symbol.hasInstance](实例) ，然后返回结果
function instance_of(L, R) {
  // 基本数据类型直接返回false
  if(typeof L !== 'object' || L === null) return false;
  let O = R.prototype;
  // L = Object.getPrototypeOf(L);
  L = L.__proto__;
  while (true) {
      if (L === null) return false;
      if (L === O) return true;
      L = L.__proto__;
  }
}

// Object.is和===的区别？
// Object在严格等于的基础上修复了一些特殊情况下的失误，具体来说就是+0和-0，NaN和NaN
function is(x, y) {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y
  } else return x !== x && y !== y;
}

function _new(Ctor, ...args) {
  if (typeof Ctor !== 'function') {
      throw 'newOperator function the first param must be a function';
  }
  // 1.创建实例对象
  let instance = Object.create(Ctor.prototype);
  // 2.会把构造函数当作普通函数执行
  // this指向创建的实例对象
  let result = Ctor.apply(instance, args);
  // 3.观察函数的返回值 没有返回值或者返回值是基本数据类型，则返回创建的实例对象
  return (typeof result === 'object' && result !== 'null') || typeof result === 'function'? result : instance;
}

Function.prototype.MyCall = function (context, ...args) {
  if (typeof this !== 'function') {
      throw new TypeError('Error');
  }
  context = context || window;
  let fn = Symbol();
  context[fn] = this;
  let res = context[fn](...args);
  Reflect.deleteProperty(context, fn);
  return res;
}

Function.prototype.MyApply = function (context, args) {
  if (typeof this !== 'function') {
      throw new TypeError('error');
  }
  context = context || window;
  let fn = Symbol();
  context[fn] = this;
  let res = context[fn](...args);
  Reflect.deleteProperty(context, fn);
  return res;
}

Function.prototype.MyBind = function (context, ...args) {
  if (typeof this !== 'function') {
      throw new TypeError('error');
  }
  context = context || window;
  let self = this;
  let fBound = function () {
      return self.apply(this instanceof fBound ? this : context, args.concat(...arguments));
  }
  // fBound.prototype = Object.create(this.prototype);
  let fNOP = function () {};
  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();
  return fBound;
}

function create(proto) {
  function F() {};
  F.prototype = proto;
  return new F();
}

// 继承
//1.原型链继承：将子类构造函数的prototype指向父类的实例对象
Child.prototype = new Parent();
//2.借用构造函数
function Child() {
    Father.call(this);
}
//3.组合继承
function Child() {
    Parent.call(this);
}
Child.prototype = new Parent();
//4.原型式继承
function object(o) {
    function F() {}
    F.prototype = o;
    return new F();
}
//5.寄生式继承
function createObj(o) {
    var clone = Object.create(o);
    clone.sayName = function () {
        console.log('hi');
    }
    return clone;
}
//6.寄生组合继承
function Parent() {
    this.name = 'parent';
    this.play = [1, 2, 3];
}

function Child() {
    Parent.call(this);
    this.type = 'child';
}
//1. 这一步不用Child.prototype =Parent.prototype的原因是怕共享内存，修改父类原型对象就会影响子类
//2. 不用Child.prototype = new Parent()的原因是会调用2次父类的构造方法（另一次是call），会存在一份多余的父类实例属性
//3. Object.create是创建了父类原型的副本，与父类原型完全隔离
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

//7.class继承
class A {
    constructor() {
        this.x = 100;
    }
    getX() {
        console.log(this.x);
    }
}

class B extends A {
    constructor() {
        super();
        this.y = 200;
    }
    getY() {
        console.log(this.y);
    }
}

let b = new B();
console.log(b);
