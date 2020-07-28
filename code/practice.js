Function.prototype.MyCall = function (context, ...args) {
  if (typeof this != 'function') throw new TypeError();
  context = context || window;
  //使用Symbol防止覆盖context上的fn属性
  let fn = Symbol();
  context[fn] = this;
  let res = context[fn](...args);
  Reflect.deleteProperty(context, fn);
  return res;
}

Function.prototype.MyApply = function (context, args) {
  if (typeof this != 'function') throw new TypeError();
  context = context || window;
  //使用Symbol防止覆盖context上的fn属性
  let fn = Symbol();
  context[fn] = this;
  let res = context[fn](...args);
  Reflect.deleteProperty(context, fn);
  return res;
}

Function.prototype.MyBind = function (context, ...args) {
  if (typeof this != 'function') throw new TypeError();
  context = context || window;
  let self = this;
  let fBound = function (..._args) {
    //apply性能不如call
    return self.apply(this instanceof fBound ? this : context, args.concat(_args));
  }
  //fBound.prototype=Object.create(this.prototype);
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
  if (typeof constructor != 'function') throw new TypeError();
  let instance = Object.create(constructor.prototype);
  let res = constructor.apply(instance, args);
  return (typeof res === 'object' && res != null) || (typeof res === 'function') ? res : instance;
}

function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    let context = this;
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay)
  }
}
// 用debounce来包装scroll的回调
// const better_scroll = debounce(() => console.log('触发了滚动事件'), 1000);
// document.addEventListener('scroll', better_scroll);

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

const isComplexData = (obj) => (typeof obj === 'object' && obj != null);
const deepClone = function (obj, hash = new WeakMap()) {
  if (hash.has(obj)) return hash.get(obj);
  let type = [Date, RegExp, Set, Map, WeakSet, WeakMap];
  if (type.includes(obj.constructor)) return new obj.constructor(obj);
  let allDesc = Object.getOwnPropertyDescriptors(obj);
  let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc);
  hash.set(obj, cloneObj);
  for (let key of Reflect.ownKeys(obj)) {
    cloneObj[key] = isComplexData(obj[key]) ? deepClone(obj[key], hash) : obj[key];
  }
  return cloneObj;
}

function curry(fn, ...args) {
  let len = fn.length;
  args = args || [];
  return function (..._args) {
    _args = _args.concat(args);
    if (_args.length < len) return curry.call(this, fn, ..._args);
    else return fn.apply(this, _args);
  }
}

function sum(a, b, c, d) {
  return a + b + c + d;
}
var fn = curry(sum, 1, 2);
console.log(fn(3)(4));
console.log(fn()()(3, 4));

let currying = function (fn, args) {
  args = args || [];
  return function () {
    if (arguments.length === 0) {
      return fn.apply(this, args);
    }
    return currying.call(this, fn, args.concat(...arguments));
  }
}

function add(...args) {
  let _add = function (..._args) {
    args = args.concat(_args);
    return _add;
  }
  _add.toString = function () {
    return args.reduce((a, b) => a + b);
  }
  return _add;
}
console.log(add(1)(2)(3)) // 6
console.log(add(1, 2, 3)(4)) // 10
console.log(add(1)(2)(3)(4)(5)) // 15
console.log(add(2, 6)(1)) // 9

class EventEmitter {
  constructor() {
    this.eventpool = {};
  }
  on(eventName, cb) {
    this.eventpool[eventName] ? this.eventpool[eventName].push(cb) : this.eventpool[eventName] = [cb];
  }
  emit(eventName, ...args) {
    this.eventpool[eventName] && this.eventpool[eventName].forEach(fn => fn(...args));
  }
  off(eventName, cb) {
    if (this.eventpool[eventName]) {
      let index = this.eventpool[eventName].indexOf(cb);
      this.eventpool[eventName].splice(index, 1);
      if (this.eventpool[eventName].length === 0) delete this.eventpool[eventName];
    }
  }
  once(eventName, cb) {
    let self = this;
    this.on(eventName, function _cb(...args) {
      cb(...args);
      self.off(eventName, _cb);
    })
  }
}

function bubbleSort(arr) {
  if (!arr || arr.length < 2) return arr;
  let lastIndex = arr.length - 1;
  while (lastIndex > 0) {
    let flag = true,
      k = lastIndex;
    for (let i = 0; i < k; i++) {
      if (arr[i] > arr[i + 1]) {
        flag = false;
        lastIndex = i;
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
      }
    }
    if (flag) break;
  }
}
var arr = [4, 5, 2, 3, 1, 6];

function selectSort(arr) {
  if (!arr || arr.length < 2) return arr;
  for (let i = 0, len = arr.length; i < len; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      min = arr[j] < arr[min] ? j : min;
    }
    [arr[i], arr[min]] = [arr[min], arr[i]];
  }
}

function insertSort(arr) {
  if (!arr || arr.length < 2) return arr;
  for (let i = 1; i < arr.length; i++) {
    for (let j = i - 1; j >= 0 && arr[j] > arr[j + 1]; j--) {
      [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
    }
  }
}

function mergeSort(arr) {
  if (!arr || arr.length < 2) return arr;
  let mid = Math.floor(arr.length / 2),
    left = arr.slice(0, mid),
    right = arr.slice(mid);
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  let res = [],
    leftLen = left.length,
    rightLen = right.length,
    len = leftLen + rightLen;
  for (let index = 0, i = 0, j = 0; index < len; index++) {
    if (i >= leftLen) res[index] = right[j++];
    else if (j >= rightLen) res[index] = left[i++];
    else if (left[i] <= right[j]) res[index] = left[i++];
    else res[index] = right[j++];
  }
  return res;
}

function quickSort(arr, start, end) {
  if (!arr || arr.length < 2) return arr;
  if (start >= end) return;
  let index = partition(arr, start, end);
  quickSort(arr, start, index - 1);
  quickSort(arr, index + 1, end);
}

function partition(arr, l, r) {
  let privot = arr[l],
    index = l;
  for (let i = l + 1; i <= r; i++) {
    if (arr[i] < privot) {
      index++;
      [arr[index], arr[i]] = [arr[i], arr[index]];
    }
  }
  [arr[index], arr[l]] = [arr[l], arr[index]];
  return index;
}
var arr = [4, 5, 2, 3, 1, 6];

const defaultCmp = (a, b) => a > b;
const swap = (arr, i, j) => ([arr[i], arr[j]] = [arr[j], arr[i]]);

class Heap {
  constructor(cmp = defaultCmp) {
    this.container = [];
    this.cmp = cmp;
  }
  insert(data) {
    const {
      container,
      cmp
    } = this;
    container.push(data);
    let index = container.length - 1;
    while (index) {
      let parent = Math.floor((index - 1) / 2);
      if (cmp(container[parent], container[index])) return;
      swap(container, parent, index);
      index = parent;
    }
  }
  extract() {
    const {
      container,
      cmp
    } = this;
    if (!container.length) return null;
    swap(container, 0, container.length - 1);
    const res = container.pop(),
      len = container.length;
    let index = 0,
      exchange = index * 2 + 1;
    while (exchange < len) {
      let right = index * 2 + 2;
      if (right < len && cmp(container[right], container[exchange])) {
        exchange = right;
      }
      if (cmp(container[index], container[exchange])) break;
      swap(container, index, exchange);
      index = exchange;
      exchange = index * 2 + 1;
    }
    return res;
  }
  top() {
    if (this.container.length) return this.container[0];
    return null;
  }
}

function heapSort(arr) {
  if (!arr || arr.length < 2) return arr;
  const res = [],
    heap = new Heap();
  for (let i = 0; i < arr.length; i++) {
    heap.insert(arr[i]);
  }
  while (heap.container.length) {
    res.unshift(heap.extract());
  }
  return res;
}