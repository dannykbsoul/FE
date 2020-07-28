//Math.max()

//reduce
function max(arr) {
  return arr.reduce((pre, cur, index, arr) => {
    return pre > cur ? pre : cur;
  })
}
console.log(max([1, 2, 5, 3, 1]));

//es6
let arr = [1, 2, 3];
Math.max(...arr);

//apply
Math.max.apply(null, arr);

//eval
let max1 = eval("Math.max(" + arr + ")")
console.log(max1);