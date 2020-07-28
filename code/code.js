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
    throw new TypeError('error');
  }
  let instance = Object.create(constructor.prototype);
  let result = constructor.apply(instance, args);
  return (result !== null && typeof result === 'object') || (typeof res === 'function') ? result : instance;
}

function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    let context = this;
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  }
}
// 用debounce来包装scroll的回调
const better_scroll = debounce(() => console.log('触发了滚动事件'), 1000);
document.addEventListener('scroll', better_scroll);


function throttle(fn, interval) {
  let last = 0;
  return function (...args) {
    let now = +new Date();
    if (now - last >= interval) {
      last = now;
      fn(...args);
    }
  }
}

const isComplexDataType = (obj) => (typeof obj === 'object' && obj !== null);
const deepClone = function (obj, hash = new WeakMap()) {
  if (hash.has(obj)) return hash.get(obj);
  const type = [RegExp, Date, Set, Map, WeakSet, WeakMap];
  if (type.includes(obj.constructor)) return new obj.constructor(obj);
  let allDesc = Object.getOwnPropertyDescriptors(obj);
  let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc);
  hash.set(obj, cloneObj);
  for (let key of Reflect.ownKeys(obj)) {
    cloneObj[key] = isComplexDataType(obj[key]) ? deepClone(obj[key], hash) : obj[key];
  }
  return cloneObj;
}

function curry(fn, args) {
  let len = fn.length;
  args = args || [];
  return function () {
    let _args = args.concat(...arguments);
    if (_args.length < len) return curry.call(this, fn, _args);
    else return fn.apply(this, _args);
  }
}

let currying = function (fn, args) {
  args = args || [];
  return function () {
    if (arguments.length === 0) {
      return fn.apply(this, args);
    }
    return currying.call(this, fn, args.concat(...arguments));
  }
}

class EventEmitter {
  constructor() {
    this.eventPool = {};
  }
  on(evenName, cb) {
    this.eventPool[evenName] ? this.eventPool[evenName].push(cb) : this.eventPool[evenName] = [cb];
  }
  emit(evenName, ...args) {
    this.eventPool[evenName] && this.eventPool[evenName].forEach(fn => fn(...args));
  }
  off(evenName, cb) {
    if (this.eventPool[evenName]) {
      let index = this.eventPool[evenName].indexOf(cb);
      this.eventPool[evenName].splice(index, 1);
      if (this.eventPool[evenName].length === 0) delete this.eventPool[evenName];
    }
  }
  once(evenName, cb) {
    let self = this;
    this.on(evenName, function _cb(...args) {
      cb(...args);
      self.off(evenName, _cb);
    })
  }
}


function flatten1(arr) {
  let res = [];
  for (let i = 0, len = arr.length; i < len; i++) {
    if (Array.isArray(arr[i])) res.push(...flatten1(arr[i]));
    else res.push(arr[i]);
  }
  return res;
}

function flatten2(arr) {
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}

function flatten3(arr) {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flatten3(cur) : cur);
  }, []);
}

function flatten4(arr) {
  return arr.toString().split(',').map(item => +item);
}

function instance_of(L, R) {
  let O = R.prototype;
  L = Object.getPrototypeOf(L);
  while (true) {
    if (!L) return false;
    if (L === O) return true;
    L = Object.getPrototypeOf(L);
  }
}

function is(x, y) {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  } else return x !== x && y !== y;
}

//实现JSON.parse()
var json = '{"name":"cxk", "age":25}';
var obj = eval("(" + json + ")");

Function.prototype.MyMap = function (fn, context) {
  let arr = this,
    mapArr = [];

  for (let i = 0, len = arr.length; i < len; i++) {
    mapArr.push(fn.call(context, arr[i], i, arr));
  }
  return mapArr;
}

Function.prototype.MyReduce = function (fn, initVal) {
  let arr = this,
    res = initVal ? initVal : arr[0],
    startIndex = initVal ? 0 : 1;

  for (let i = startIndex, len = arr.length; i < len; i++) {
    res = fn.call(null, res, arr[i], i, arr);
  }
  return res;
}

Function.prototype.MyMap1 = function (fn) {
  let arr = this;
  return arr.reduce((pre, cur, index, arr) => {
    pre.push(fn(cur, index, arr));
    return pre;
  }, []);
}

Array.prototype.MyIsArray = function (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
}

function max(arr) {
  return arr.reduce((pre, cur) => {
    return pre > cur ? pre : cur;
  })
}
Math.max(...arr);
Math.max.apply(null, arr);
let max1 = eval('Math.max(' + arr + ')');

let a = new Set([1, 2, 3, 4]);
let b = new Set([3, 4, 5, 6]);
let union = new Set([...a, ...b]);
let intersection = [...a].filter(x => b.has(x));
let diff = [...a].filter(x => !b.has(x));

function unique1(arr) {
  let res = [];
  for (let i = 0, len = arr.length; i < len; i++) {
    if (res.indexOf(arr[i]) === -1) res.push(arr[i]);
  }
  return res;
}

function unique2(arr) {
  return arr.filter((item, index, arr) => {
    return arr.indexOf(item) === index;
  })
}

function unique3(arr) {
  return Array.from(new Set(arr));
}

function unique4(arr) {
  const map = new Map();
  return arr.filter((item) => {
    return !map.has(item) && map.set(item, 1);
  })
}
//和set一样，对象不去重，NaN去重

function unique5(arr) {
  const obj = {};
  return arr.filter((item) => {
    let flag = typeof item + JSON.stringify(item);
    return obj.hasOwnProperty(flag) ? false : (obj[flag] = true);
  })
}

function single() {};
const Singleton = (function () {
  let instance = null;
  return function () {
    if (!instance) {
      instance = new single();
    }
    return instance;
  }
})();

class Singleton {
  static getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}

var light = (timer, cb) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      cb();
      resolve();
    }, timer);
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

const sleep1 = time => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  })
}
sleep1(1000).then(() => {
  console.log('1')
});

function random(arr) {
  for (let i = arr.length; i; i--) {
    let index = Math.floor(Math.random() * i);
    [arr[i - 1], arr[index]] = [arr[index], arr[i - 1]];
  }
  return arr;
}


class Promise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacksFn = [];
    this.onRejectedCallbacksFn = [];
    let resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.onResolvedCallbacksFn.forEach(fn => fn());
      }
    }
    let reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacksFn.forEach(fn => fn());
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
    onRejected = typeof onRejected === 'function' ? onRejected : e => {
      throw e
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
        }, 0);
      }
      if (this.state === 'rejected') {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      if (this.state === 'pending') {
        this.onResolvedCallbacksFn.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0)
        })
        this.onRejectedCallbacksFn.push(() => {
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
        setTimeout(() => {
          throw reason;
        }, 0);
      })
  }
  finally(cb) {
    this.then(value => {
      return Promise.resolve(cb()).then(() => {
        return value;
      })
    }, e => {
      return Promise.resolve(cb()).then(() => {
        throw e;
      })
    })
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (x === promise2) reject(new TypeError('error'));
  let called;
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      then = x.then;
      if (typeof then === 'function') {
        then.call(x, y => {
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
      val.then(resolve, reject);
    }
    resolve(val);
  })
}

Promise.reject = function (reason) {
  return new Promise((resolve, reject) => {
    reject(reason);
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
    let num = 0,
      promiseArr = [],
      len = promises.length;
    for (let i = 0; i < len; i++) {
      Promise.resolve(promises[i]).then(val => {
        num++;
        promiseArr[i] = val;
        if (num === len) resolve(promiseArr);
      }, e => {
        reject(e);
      })
    }
  })
}

//模拟实现迭代器
function iterator(arr) {
  let nextIndex = 0;
  return {
    next() {
      return nextIndex < arr.length ? {
        value: arr[nextIndex++],
        done: false
      } : {
        value: undefined,
        done: true
      }
    }
  }
}
let iter = Iterator([1, 2, 3, 4]);
console.log(iter.next())
console.log(iter.next())
console.log(iter.next())
console.log(iter.next())
console.log(iter.next())

//生成器generator
function* fibonacci() {
  let [pre, cur] = [0, 1];
  while (true) {
    yield pre;
    [pre, cur] = [cur, pre + cur];
  }
}
for (let n of fibonacci()) {
  if (n > 1000) break;
  console.log(n);
}

//总结：其实上面的var iter = Iterator([1, 2, 3, 4]);还有var = fibonacci();
//都会生成一个迭代器，一个是我们模拟的，一个是js自带的，叫做生成器，执行生成器得到迭代器，
//迭代器可以通过iter.next()的方式得到{value:..,done:..}的对象，因为是迭代器，所以可以
//被for...of遍历，或者如果对象有属性名为Symbol.iterator的函数，那么for of会自动执行这个
//函数，得到迭代器进行遍历

const getData = () =>
  new Promise(resolve => setTimeout(() => resolve("data"), 1000))

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
//co库，自动执行generator
function spawn(genF) {
  return new Promise((resolve, reject) => {
    const gen = genF();

    function step(key, arg) {
      let res;
      try {
        res = gen[key](arg);
      } catch (e) {
        reject(e);
      }
      const {
        value,
        done
      } = res;
      if (done) return resolve(value);
      else return Promise.resolve(value).then(val => step("next", val), e => step("throw", e));
    }
    step("next");
  })
}
spawn(testG).then(result => {
  console.log(result)
})

//接收一定的参数，生产出定制化的函数，然后使用定制化的函数去完成功能。
let isString = (obj) => {
  return Object.prototype.toString.call(obj) === '[object String]';
};
let isFunction = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Function]';
};
let isArray = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Array]';
};
let isSet = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Set]';
};

let isType = (type) => {
  return (obj) => {
    return Object.prototype.toString.call(obj) === `[object ${type}]`;
  }
}

let isString = isType('String');
let isFunction = isType('Function');

isString("123");
isFunction(val => val);