//push
Array.prototype.push2 = function (...rest) {
  this.splice(this.length, 0, ...rest)
  return this.length;
}

//pop
Array.prototype.pop2 = function () {
  return this.splice(this.length - 1, 1)[0];
}

//阶乘
const factorial1 = n => {
  if (n <= 1) return 1
  return n * factorial1(n - 1)
}
//阶乘尾递归优化
const factorial2 = (n, total = 1) => {
  if (n <= 1) return total;
  return factorial2(n - 1, total * n);
}

//斐波那契
//递归
function fib1(n) {
  if (n === 1 || n === 2) return n - 1;
  return fib1(n - 1) + fib1(n - 2);
}
console.log(fib1(3));
//非递归
function fib2(n) {
  let pre = 0,
    cur = 1;
  for (let i = 2; i <= n; i++) {
    [pre, cur] = [cur, pre + cur];
  }
  return pre;
}
console.log(fib2(3));

//实现栈结构
const Stack = (() => {
  const wm = new WeakMap();
  class Stack {
    constructor() {
      wm.set(this, []);
    }
    push(...nums) {
      let list = wm.get(this);
      list.splice(list.length, 0, ...nums);
      return list.length;
    }
    pop() {
      let list = wm.get(this);
      return list.splice(list.length - 1, 1)[0];
    }

    peek() {
      let list = wm.get(this);
      return list[list.length - 1];
    }
    clear() {
      let list = wm.get(this);
      list.length = 0;
    }
    size() {
      return this.length;
    }
    output() {
      return wm.get(this);
    }
    isEmpty() {
      return wm.get(this).length === 0;
    }
  }
  return Stack;
})()

let s = new Stack()

s.push(1, 2, 3, 4, 5)
console.log(s.output()) // [ 1, 2, 3, 4, 5 ]
s.push(6, 7);
console.log(s.pop());
console.log(s);
console.log(s.peek());
console.log(s);
console.log(s.size());
console.log(s.isEmpty());
s.clear();
console.log(s.isEmpty());

// 类数组
//可以看出push会添加索引为length的属性，如果已经存在，那么会覆盖
let obj = {
  '1': 'a',
  '2': 'b',
  length: 2,
  push: Array.prototype.push
};

// Array.prototype.push.call(obj, 'c');
obj.push('c')

console.log(obj); // { '1': 'a', '2': 'c', length: 3 }


//字符串repeat实现
// 原生repeat
'ni'.repeat(3); // 'ninini'

// 实现一
String.prototype.repeatString1 = function (n) {
  return Array(n + 1).join(this);
}
console.log('ni'.repeatString1(3));

// 实现二
String.prototype.repeatString2 = function (n) {
  return Array(n).fill(this).join('');
}
console.log('ni'.repeatString2(3));

//if (a == 1 & a == 2 & a == 3)

//方法一
var a = {
  a: 1,
  toString() {
    return this.a++
  }
}

if (a == 1 && a == 2 && a == 3) {
  console.log('OK');
}

//方法二
var a = [1, 2, 3];
a.toString = a.shift;

//方法三 Object.defineProperty
var i = 1;
Object.defineProperty(window, 'a', {
  get() {
    return i++;
  }
})


console.log(1);
setTimeout(_ => {
  console.log(2);
}, 1000);
async function fn() {
  console.log(3);
  setTimeout(_ => {
    console.log(4);
  }, 20);
  return Promise.reject();
}
async function run() {
  console.log(5);
  await fn();
  console.log(6);
}
run();
// 需要执行150MS左右
for (let i = 0; i < 90000000; i++) {}
setTimeout(_ => {
  console.log(7);
  new Promise(resolve => {
    console.log(8);
    resolve();
  }).then(_ => {
    console.log(9);
  });
}, 0);
console.log(10);
//1 5 3 10 4 7 8 9 2