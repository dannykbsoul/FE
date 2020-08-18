//实现map
Array.prototype.MyMap = function (fn, context) {
  const arr = this,
    mapArr = [];
  for (let i = 0, len = arr.length; i < len; i++) {
    mapArr.push(fn.call(context, arr[i], i, this));
  }
  return mapArr;
}
//实现reduce
Array.prototype.MyReduce = function (fn, initVal) {
  let arr = this,
    res = initVal ? initVal : arr[0],
    startIndex = initVal ? 0 : 1;
  for (let i = startIndex, len = arr.length; i < len; i++) {
    res = fn.call(null, res, arr[i], i, this);
  }
  return res;
}
//reduce实现map
Function.prototype.MyMap1 = function (fn) {
  const arr = this;
  return arr.reduce((pre, cur, index, arr) => {
    pre.push(fn(cur, index, arr));
    return pre;
  }, [])
}

Array.MyIsArray = function (arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
};