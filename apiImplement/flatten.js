let arr = [1, [2, [3, [4]]]];

//es6的flat方法 参数是flat的深度
// ary = ary.flat(Infinity);

//递归
function flatten1(arr) {
  let res = [];
  for (let i = 0, len = arr.length; i < len; i++) {
    if (Array.isArray(arr[i])) res.push(...flatten1(arr[i]));
    else res.push(arr[i]);
  }
  return res;
}
//toString 如果数组中都是数字的话
function flatten2(arr) {
  return arr.toString().split(',').map(item => +item);
}
//reduce
function flatten3(arr) {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flatten3(cur) : cur);
  }, [])
}
//...拓展运算符
function flatten4(arr) {
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}
//带深度的flat
function flatten4(arr, depth) {
  while (depth--) {
    arr = [].concat(...arr);
  }
  return arr;
}
console.log(flatten4(arr, 2));