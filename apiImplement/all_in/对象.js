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
    F.prototype.constructor = F;
    return new F();
}

function myNew(constructor, ...args) {
    if (typeof constructor !== 'function') {
        throw 'newOperator function the first param must be a function';
    }
    let instance = Object.create(constructor.prototype);
    let result = constructor.apply(instance, args);
    return (typeof result === 'object' && result !== 'null') || typeof result === 'function' ? result : instance;
}

function instance_of(L, R) {
    let O = R.prototype;
    // L = Object.getPrototypeOf(L);
    L = L.__proto__;
    while (true) {
        if (L === null) return false;
        if (L === O) return true;
        L = L.__proto__;
    }
}

// Symbol.hasInstance可以自定义instanceof的行为，所以说也不是很可靠
class PrimitiveString {
    static[Symbol.hasInstance](x) {
        return typeof x === 'string'
    }
}
console.log('hello world'
    instanceof PrimitiveString) // true

// Object.is()
function is(x, y) {
    if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
    } else return x !== x && y !== y;
}

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