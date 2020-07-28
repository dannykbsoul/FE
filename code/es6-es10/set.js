//let set=new Set();
//Set函数可以接受一个数组(或者具有iterable接口的其他数据接口)作为参数，用来初始化
//属性和方法 add、delete、has、clear
//keys()、values()、entries()、forEach()
function init(obj, cb) {
  console.log(obj)
  if (typeof obj[Symbol.iterator] !== 'function') throw new TypeError(obj + " is not iterable");
  let iterable = obj[Symbol.iterator](),
    result = iterable.next();
  while (!result.done) {
    cb(result.value);
    result = iterable.next();
  }
}

function makeIterator(array, iterator) {
  let nextIndex = 0;
  let obj = {
    next() {
      return nextIndex < array.length ? {
        value: iterator(array[nextIndex++]),
        done: false
      } : {
        value: undefined,
        done: true
      };
    }
  }
  obj[Symbol.iterator] = function () {
    return obj;
  }
  return obj;
}

class MySet {
  constructor(data) {
    this._values = [];
    this.size = 0;
    init(data, (item) => {
      this.add(item);
    });
  }
  add(value) {
    if (!this._values.includes(value)) {
      this._values.push(value);
      this.size++;
    }
    return this;
  }
  has(value) {
    return this._values.findIndex(item => Object.is(item, value)) !== -1;
  }
  delete(value) {
    let idx = this._values.findIndex(item => Object.is(item, value));
    if (idx === -1) return false;
    this._values.splice(idx, 1);
    this.size--;
    return true;
  }
  clear() {
    this._values = [];
    this.size = 0;
  }
  keys() {
    return makeIterator(this._values, value => value);
  }
  values() {
    return makeIterator(this._values, value => value);
  }
  entries() {
      return makeIterator(this._values, value => [value, value]);
    }
    [Symbol.iterator]() {
      return this.values();
    }
}

let set = new MySet(new MySet([1, 2, 3]));
console.log(set.size); // 3

console.log([...set.keys()]); // [1, 2, 3]
console.log([...set.values()]); // [1, 2, 3]
console.log([...set.entries()]); // [1, 2, 3]
console.log(set.keys)