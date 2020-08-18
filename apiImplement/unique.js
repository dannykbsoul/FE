//双层循环
//缺点 对象和NaN无法去重
function unique(arr) {
  let res = [];
  for (let i = 0, len1 = arr.length; i < len1; i++) {
    let j = 0,
      len2 = res.length;
    for (; j < len2; j++) {
      if (arr[i] === res[j]) break;
    }
    if (j === len2) res.push(arr[i]);
  }
  return res;
}

//indexOf
function unique(arr) {
  let res = [];
  for (let i = 0, len = arr.length; i < len; i++) {
    if (res.indexOf(arr[i]) === -1) {
      res.push(arr[i]);
    }
  }
  return res;
}

//sort
function unique(arr) {
  let res = [],
    sortedArr = arr.concat().sort(),
    //你对数组进行了 array.concat()操作之后，相当于复制出来一份原有的数组，
    //且对复制出来的新数组的操作不会影响到原有数组
    seen;
  for (let i = 0, len = sortedArr.length; i < len; i++) {
    if (!i || seen !== sortedArr[i]) res.push(sortedArr[i]);
    seen = sortedArr[i];
  }
  return res;
}

//filter+indexOf
function unique(arr) {
  return arr.filter((item, index, array) => {
    return array.indexOf(item) === index;
  });
}

//filter+sort
function unique(arr) {
  return arr
    .concat()
    .sort()
    .filter((item, index, array) => {
      return !index || item !== array[index - 1];
    });
}

//object键值对
function unique(arr) {
  let obj = {};
  return arr.filter((item, index, arr) => {
    return obj.hasOwnProperty(typeof item + JSON.stringify(item)) ?
      false :
      (obj[typeof item + JSON.stringify(item)] = true);
  });
}

//es6
function unique(arr) {
  return Array.from(new Set(arr)); //Array.from将可迭代对象转换成数组
}

function unique8(arr) {
  const seen = new Map();
  return arr.filter((item, index, arr) => {
    return !seen.has(item) && seen.set(item, 1);
  });
}

function unique7(arr) {
  const seen = new Map();
  return arr.filter((item, index, array) => {
    const flag = typeof item + JSON.stringify(item);
    return !seen.has(flag) && seen.set(flag, 1);
  });
}