//浅拷贝
//Object.assign(target,source)
let target = {};
let source = {
  a: {
    b: 2
  }
};
Object.assign(target, source);
console.log(target); // { a: { b: 2 } };
source.a.b = 10;
console.log(source); // { a: { b: 10 } };
console.log(target); // { a: { b: 10 } };
//...拓展运算符
let a = {
  age: 1
}
let b = {
  ...a
};
a.age = 2;
console.log(b.age) // 1
//slice,concat实现数组的浅拷贝
var arr = [{
    old: 'old'
  },
  ['old']
];

var new_arr = arr.concat();

arr[0].old = 'new';
arr[1][0] = 'new';

console.log(arr) // [{old: 'new'}, ['new']]
console.log(new_arr) // [{old: 'new'}, ['new']]

//深拷贝
//JSON.stringify()和JSON.parse()

//递归 bfs dfs
let deepCopy = function (obj) {
  let newObj = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key];
    }
  }
  return newObj;
}
let obj1 = {
  a: {
    b: 1
  },
  c: 1
};
let obj2 = deepCopy(obj1);
obj1.a.b = 2;
console.log(obj1);
console.log(obj2);

function getEmptyArrOrObj(item) {
  let itemType = Object.prototype.toString.call(item);
  if (itemType === "[object Object]") return {};
  else if (itemType === "[object Array]") return [];
  else return item;
}

function deepCopyDfs(origin) {
  const stack = [];
  const map = new Map();
  let target = getEmptyArrOrObj(origin);
  stack.push([origin, target]);
  map.set(origin, target);
  while (stack.length) {
    let [ori, tar] = stack.pop();
    for (let key in ori) {
      if (ori.hasOwnProperty(key)) {
        if (map.get(ori[key])) {
          tar[key] = map.get(ori[key]);
          continue;
        }
        tar[key] = getEmptyArrOrObj(ori[key]);
        stack.push([ori[key], tar[key]]);
        map.set(ori[key], tar[key]);
      }
    }
  }
  return target;
}

const isComplexDataType = obj => (typeof obj === 'object' || typeof obj === 'function') && (obj !== null);
const deepClone = function (obj, hash = new WeakMap()) {
  if (hash.has(obj)) return hash.get(obj);

  let type = [Date, RegExp, Set, Map, WeakMap, WeakSet];
  if (type.includes(obj.constructor)) return new obj.constructor(obj);

  //返回所指定对象的所有自身属性的描述符，如果没有任何自身属性，则返回空对象。
  let allDesc = Object.getOwnPropertyDescriptors(obj);
  //继承原型
  let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc);
  hash.set(obj, cloneObj);

  //拷贝不可枚举类型和符号类型
  //Reflect.ownKeys和Object.keys的区别是：
  //前者可以获取对象自身所有属性，而后者只能获取到自身可枚举类型，不包括Symbol
  for (let key of Reflect.ownKeys(obj)) {
    cloneObj[key] = (isComplexDataType(obj[key]) && typeof obj[key] !== 'function') ? deepClone(obj[key], hash) : obj[key];
  }
  return cloneObj;
}


function Son(name) {
  this.name = name;
}
Son.prototype.age = 18;
let mysymbol = Symbol(1);

const obj4 = {
  b: new Set([1]),
  a: function fn1() {
    console.log(777)
  },
  c: () => {},
  d: new RegExp(),
  e: new Date(),
  g: new Son('zj'),
  [mysymbol]: 1
};
let newA = deepClone(obj4);
obj4.b.add(12);
console.log(obj4)
console.log(newA)
console.log(newA['g'] === obj4['g'])
console.log(obj4.a());
console.log(newA.a());