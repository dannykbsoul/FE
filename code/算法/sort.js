// function quicksort(arr, start, end) {
//   if (!Array.isArray(arr) || arr.length <= 1 || start > end) return;
//   let index = partition(arr, start, end);
//   // quicksort(arr, start, index - 1);
//   // quicksort(arr, index + 1, end);
// }

// function partition(arr, l, r) {
//   let pivot = arr[l],
//     index = l;
//   for (let i = l + 1; i <= r; i++) {
//     if (arr[i] < pivot) {
//       [arr[i], arr[++index]] = [arr[++index], arr[i]];
//     }
//   }
//   [arr[index], arr[l]] = [arr[l], arr[index]];
//   return index;
// }

// var arr = [6, 2, 3, 4, 1, 5];
// partition(arr, 0, arr.length - 1);
// console.log(arr);

var arr = [6, 2, 3, 4, 1, 5];

// 最后一个交换元素的位置用来表示后面的都已经排序完成
// 最近的一轮循环中有没有发生交换，如果没有则说明全部有序
function bubbleSort(arr) {
  if (!Array.isArray(arr) || arr.length <= 1) return;
  let lastIndex = arr.length - 1;
  while (lastIndex > 0) {
    // 当最后一个交换的元素为第一个时，说明后面全部排序完毕
    let flag = true,
      k = lastIndex;
    for (let j = 0; j < k; j++) {
      if (arr[j] > arr[j + 1]) {
        flag = false;
        lastIndex = j; // 设置最后一次交换元素的位置
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
    if (flag) break;
  }
}

// 每次选出最小的元素放在前面
function selectSort(array) {
  let length = array.length;
  // 如果不是数组或者数组长度小于等于1，直接返回，不需要排序
  if (!Array.isArray(array) || length <= 1) return;
  for (let i = 0; i < length - 1; i++) {
    let minIndex = i; // 设置当前循环最小元素索引
    for (let j = i + 1; j < length; j++) {
      // 如果当前元素比最小元素索引，则更新最小元素索引
      if (array[minIndex] > array[j]) {
        minIndex = j;
      }
    }
    // 交换最小元素到当前位置
    [array[i], array[minIndex]] = [array[minIndex], array[i]];
  }
  return array;
}

// 每次将当前元素插入到前面已排序的里面去，就像打扑克一样
function insertSort(array) {
  let length = array.length;
  // 如果不是数组或者数组长度小于等于1，直接返回，不需要排序
  if (!Array.isArray(array) || length <= 1) return;
  // 循环从 1 开始，0 位置为默认的已排序的序列
  for (let i = 1; i < length; i++) {
    let temp = array[i]; // 保存当前需要排序的元素
    let j = i;
    // 在当前已排序序列中比较，如果比需要排序的元素大，就依次往后移动位置
    while (j - 1 >= 0 && array[j - 1] > temp) {
      array[j] = array[j - 1];
      j--;
    }
    // 将找到的位置插入元素
    array[j] = temp;
  }
  return array;
}

function hillSort(array) {
  let length = array.length;
  // 如果不是数组或者数组长度小于等于1，直接返回，不需要排序
  if (!Array.isArray(array) || length <= 1) return;
  // 第一层确定增量的大小，每次增量的大小减半
  for (let gap = parseInt(length >> 1); gap >= 1; gap = parseInt(gap >> 1)) {
    // 对每个分组使用插入排序，相当于将插入排序的1换成了 n
    for (let i = gap; i < length; i++) {
      let temp = array[i];
      let j = i;
      while (j - gap >= 0 && array[j - gap] > temp) {
        array[j] = array[j - gap];
        j -= gap;
      }
      array[j] = temp;
    }
  }
  return array;
}

function mergeSort(array) {
  let length = array.length;
  // 如果不是数组或者数组长度小于等于0，直接返回，不需要排序
  if (!Array.isArray(array) || length === 0) return;
  if (length === 1) {
    return array;
  }
  let mid = parseInt(length >> 1), // 找到中间索引值
    left = array.slice(0, mid), // 截取左半部分
    right = array.slice(mid, length); // 截取右半部分
  return merge(mergeSort(left), mergeSort(right)); // 递归分解后，进行排序合并
}

function merge(leftArray, rightArray) {
  let result = [],
    leftLength = leftArray.length,
    rightLength = rightArray.length,
    il = 0,
    ir = 0;
  // 左右两个数组的元素依次比较，将较小的元素加入结果数组中，直到其中一个数组的元素全部加入完则停止
  while (il < leftLength && ir < rightLength) {
    if (leftArray[il] < rightArray[ir]) {
      result.push(leftArray[il++]);
    } else {
      result.push(rightArray[ir++]);
    }
  }
  // 如果是左边数组还有剩余，则把剩余的元素全部加入到结果数组中。
  while (il < leftLength) {
    result.push(leftArray[il++]);
  }
  // 如果是右边数组还有剩余，则把剩余的元素全部加入到结果数组中。
  while (ir < rightLength) {
    result.push(rightArray[ir++]);
  }
  return result;
}

function quickSort(array, start, end) {
  let length = array.length;
  // 如果不是数组或者数组长度小于等于1，直接返回，不需要排序
  if (!Array.isArray(array) || length <= 1 || start >= end) return;
  let index = partition(array, start, end); // 将数组划分为两部分，并返回右部分的第一个元素的索引值
  quickSort(array, start, index - 1); // 递归排序左半部分
  quickSort(array, index + 1, end); // 递归排序右半部分
}

function partition(array, start, end) {
  let pivot = array[start]; // 取第一个值为枢纽值，获取枢纽值的大小
  // 当 start 等于 end 指针时结束循环
  while (start < end) {
    // 当 end 指针指向的值大等于枢纽值时，end 指针向前移动
    while (array[end] >= pivot && start < end) {
      end--;
    }
    // 将比枢纽值小的值交换到 start 位置
    array[start] = array[end];
    // 移动 start 值，当 start 指针指向的值小于枢纽值时，start 指针向后移动
    while (array[start] < pivot && start < end) {
      start++;
    }
    // 将比枢纽值大的值交换到 end 位置，进入下一次循环
    array[end] = array[start];
  }
  // 将枢纽值交换到中间点
  array[start] = pivot;
  // 返回中间索引值
  return start;
}

// 首先建立大根堆
function heapSort(array) {
  let length = array.length;
  // 如果不是数组或者数组长度小于等于1，直接返回，不需要排序
  if (!Array.isArray(array) || length <= 1) return;
  buildMaxHeap(array); // 将传入的数组建立为大顶堆
  // 每次循环，将最大的元素与末尾元素交换，然后剩下的元素重新构建为大顶堆
  for (let i = length - 1; i > 0; i--) {
    swap(array, 0, i);
    adjustMaxHeap(array, 0, i); // 将剩下的元素重新构建为大顶堆
  }
  return array;
}

function adjustMaxHeap(array, index, heapSize) {
  let iMax, iLeft, iRight;
  while (true) {
    iMax = index; // 保存最大值的索引
    iLeft = 2 * index + 1; // 获取左子元素的索引
    iRight = 2 * index + 2; // 获取右子元素的索引
    // 如果左子元素存在，且左子元素大于最大值，则更新最大值索引
    if (iLeft < heapSize && array[iMax] < array[iLeft]) {
      iMax = iLeft;
    }
    // 如果右子元素存在，且右子元素大于最大值，则更新最大值索引
    if (iRight < heapSize && array[iMax] < array[iRight]) {
      iMax = iRight;
    }
    // 如果最大元素被更新了，则交换位置，使父节点大于它的子节点，同时将索引值跟新为被替换的值，继续检查它的子树
    if (iMax !== index) {
      swap(array, index, iMax);
      index = iMax;
    } else {
      // 如果未被更新，说明该子树满足大顶堆的要求，退出循环
      break;
    }
  }
}
// 构建大顶堆
function buildMaxHeap(array) {
  let length = array.length,
    iParent = parseInt(length >> 1) - 1; // 获取最后一个非叶子点的元素
  for (let i = iParent; i >= 0; i--) {
    adjustMaxHeap(array, i, length); // 循环调整每一个子树，使其满足大顶堆的要求
  }
}
// 交换数组中两个元素的位置
function swap(array, i, j) {
  let temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}
console.log(arr);
heapSort(arr);
console.log(arr);

function radixSort(arr) {
  let len = arr.length;
  // 如果不是数组或者数组长度小于等于1，直接返回，不需要排序
  if (!Array.isArray(arr) || len <= 1) return;
  // 确定排序数组中的最大值以及最大值的位数
  let bucket = [],
    max = Math.max(...arr),
    loop = (max + "").length;
  for (let i = 0; i < loop; i++) {
    // 初始化桶
    for (let i = 0; i < 10; i++) {
      bucket[i] = [];
    }
    for (let j = 0; j < len; j++) {
      let str = arr[j] + "";
      if (str.length >= i + 1) {
        let k = parseInt(str[str.length - i - 1]);
        bucket[k].push(arr[j]); // 获取当前位的值，作为插入的索引
      } else {
        bucket[0].push(arr[j]); // 处理位数不够的情况，高位默认为 0
      }
    }
    // 清空旧的数组
    arr.splice(0, len);
    // 使用桶重新初始化数组
    bucket.reduce((pre, cur, index) => {
      !Array.isArray(cur) ? pre.push(cur) : pre.push(...cur);
      return pre;
    }, arr);
  }
  return arr;
}
var arr = [73, 22, 93, 43, 55, 14, 28, 65, 39, 81];
radixSort(arr);
console.log(arr);
function bigNumberAdd(number1, number2) {
  let result = "", // 保存最后结果
    carry = false; // 保留进位结果
  // 将字符串转换为数组
  number1 = number1.split("");
  number2 = number2.split("");
  // 当数组的长度都变为0，并且最终不再进位时，结束循环
  while (number1.length || number2.length || carry) {
    // 每次将最后的数字进行相加，使用~~的好处是，即使返回值为 undefined 也能转换为 0
    carry += ~~number1.pop() + ~~number2.pop();
    // 取加法结果的个位加入最终结果
    result = (carry % 10) + result;
    // 判断是否需要进位，true 和 false 的值在加法中会被转换为 1 和 0
    carry = carry > 9;
  }
  // 返回最终结果
  return result;
}

function bigIntAdd(num1, num2) {
  let res = "", // 保存最后结果
    carry = false; // 保留进位结果
  // 将字符串转换为数组
  num1 = num1.split("");
  num2 = num2.split("");
  // 当数组的长度都变为0，并且最终不再进位时，结束循环
  while (num1.length || num2.length || carry) {
    // 每次将最后的数字进行相加，使用~~的好处是，即使返回值为 undefined 也能转换为 0
    carry += ~~num1.pop() + ~~num2.pop();
    // 取加法结果的个位加入最终结果
    res = (carry % 10) + res;
    // 判断是否需要进位，true 和 false 的值在加法中会被转换为 1 和 0
    carry = carry > 9;
  }
  // 返回最终结果
  return res;
}
bigIntAdd("123", "456");

function getMaxCommonDivisor(a, b) {
  if (b === 0) return a;
  return getMaxCommonDivisor(b, a % b);
}
