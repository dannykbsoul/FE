//实现map
Array.prototype.MyMap = function (fn, context) {
  var arr = Array.prototype.slice.call(this);
  var mapArr = [];
  for (var i = 0, len = arr.length; i < len; i++) {
    mapArr.push(fn.call(context, arr[i], i, this));
  }
  return mapArr;
}
//实现reduce
Array.prototype.MyReduce = function (fn, initVal) {
  var arr = Array.prototype.slice.call(this);
  var res = initVal ? initVal : arr[0];
  var startIndex = initVal ? 0 : 1;
  for (var i = startIndex, len = arr.length; i < len; i++) {
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