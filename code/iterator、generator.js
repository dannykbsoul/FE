//iterator原理
function Iterator(array) {
  let nextIndex = 0;
  return {
    next() {
      return nextIndex < array.length ? {
        value: array[nextIndex++],
        done: false
      } : {
        value: undefined,
        done: true
      };
    }
  }
}
let iter = Iterator([1, 2, 3, 4]);
console.log(iter.next())
console.log(iter.next())
console.log(iter.next())
console.log(iter.next())
console.log(iter.next())

//使类数组对象变的iterable
let arrayLike = {
  length: 2,
  0: 'a',
  1: 'b'
};

arrayLike[Symbol.iterator] = Array.prototype[Symbol.iterator];
for (let x of arrayLike) {
  console.log(x);
}

//遍历器版本的generator
let arr = [1, [
    [2, 3], 4
  ],
  [5, 6]
];
let flat = function* (a) {
  let length = a.length;
  for (let i = 0; i < length; i++) {
    let item = a[i];
    if (Array.isArray(item)) {
      yield* flat(item);
    } else {
      yield item;
    }
  }
};
for (let f of flat(arr)) {
  console.log(f);
}


//generator版斐波那契
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

//generator遍历二叉树
// 下面是二叉树的构造函数，
// 三个参数分别是左树、当前节点和右树
function Tree(left, label, right) {
  this.left = left;
  this.label = label;
  this.right = right;
}
// 下面是中序（inorder）遍历函数。
// 由于返回的是一个遍历器，所以要用generator函数。
// 函数体内采用递归算法，所以左树和右树要用yield*遍历
function* inorder(t) {
  if (t) {
    yield* inorder(t.left);
    yield t.label;
    yield* inorder(t.right);
  }
}
// 下面生成二叉树
function make(array) {
  // 判断是否为叶节点
  if (array.length == 1) return new Tree(null, array[0], null);
  return new Tree(make(array[0]), array[1], make(array[2]));
}
let tree = make([
  [
    ['a'], 'b', ['c']
  ], 'd', [
    ['e'], 'f', ['g']
  ]
]);
// 遍历二叉树
var result = [];
for (let node of inorder(tree)) {
  result.push(node);
}
result
// ['a', 'b', 'c', 'd', 'e', 'f', 'g']