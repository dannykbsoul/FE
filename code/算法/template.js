//用自身做hash表系列
var findRepeatNumber = function (nums) {
  for (let i = 0, len = nums.length; i < len; i++) {
    while (nums[i] >= 0 && nums[i] <= len - 2 && nums[i] != i && nums[nums[i]] != nums[i]) {
      let index = nums[i];
      [nums[i], nums[index]] = [nums[index], nums[i]];
    }
  }
  for (let i = 0, len = nums.length; i < len; i++) {
    if (nums[i] != i) return nums[i];
  }
};

//链表问题 递归+非递归
//对于递归算法，最重要的就是明确递归函数的定义。具体来说，我们的reverseList函数定义是这样的：
//输入一个节点head，将以head为起点的链表反转，并返回反转之后的头结点。
var reverseList = function (head) {
  if (!head || !head.next) return head;
  let last = reverseList(head.next);
  head.next.next = head;
  head.next = null;
  return last;
};

//合并俩个链表
function mergeTwo(l1, l2) {
  if (!l1) return l2;
  if (!l2) return l1;
  let head;
  if (l1.val <= l2.val) {
    head = l1;
    head.next = mergeTwo(l1.next, l2);
  } else {
    head = l2;
    head.next = mergeTwo(l1, l2.next);
  }
  return head;
}



//二分搜索系列
function left_bound(nums, target) {
  let l = 0,
    r = nums.length - 1;
  while (l <= r) {
    let mid = Math.floor(l + (r - l) / 2);
    if (nums[mid] === target) r = mid - 1;
    else if (nums[mid] < target) l = mid + 1;
    else r = mid - 1;
  }
  if (l >= nums.length || nums[l] !== target) return -1;
  return l;
}

function right_bound(nums, target) {
  let l = 0,
    r = nums.length - 1;
  while (l <= r) {
    let mid = Math.floor(l + (r - l) / 2);
    if (nums[mid] === target) l = mid + 1;
    else if (nums[mid] < target) l = mid + 1;
    else r = mid - 1;
  }
  if (r < 0 || nums[r] !== target) return -1;
  return r;
}

//大根堆
function swap(arr, i, j) {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

class MaxHeap {
  constructor(arr = []) {
    this.container = [];
    if (Array.isArray(arr)) {
      arr.forEach(v => this.insert(v));
    }
  }
  insert(data) {
    const arr = this.container;
    arr.push(data);
    let index = arr.length - 1;
    while (index) {
      let parent = Math.floor((index - 1) / 2);
      if (arr[parent] >= arr[index]) break;
      swap(arr, index, parent);
      index = parent;
    }
  }
  extract() {
    const arr = this.container;
    if (!arr.length) return null;
    swap(arr, 0, arr.length - 1);
    const res = arr.pop(),
      len = arr.length;
    let index = 0,
      exchange = index * 2 + 1;

    while (exchange < len) {
      // 如果有右节点，并且右节点的值大于左节点的值
      let right = index * 2 + 2;
      if (right < len && arr[right] > arr[exchange]) {
        exchange = right;
      }
      if (arr[exchange] <= arr[index]) {
        break;
      }
      swap(arr, exchange, index);
      index = exchange;
      exchange = index * 2 + 1;
    }
    return res;
  }
  top() {
    if (this.container.length) return this.container[0];
    return null;
  }
}
/**
 * @param {number[]} arr
 * @param {number} k
 * @return {number[]}
 */
var getLeastNumbers = function (arr, k) {
  const len = arr.length;
  if (len <= k) return arr;
  const heap = new MaxHeap(arr.slice(0, k));
  for (let i = k; i < len; i++) {
    if (arr[i] < heap.top()) {
      heap.extract();
      heap.insert(arr[i]);
    }
  }
  return heap.container;
};


//快速排序 最小的k个数
var getLeastNumbers = function (arr, k) {
  const len = arr.length;
  if (len <= k) return arr;
  let l = 0,
    r = len - 1;
  shuffle(arr);
  let index = partition(arr, l, r);
  while (l <= r) {
    let mid = partition(arr, l, r);
    if (mid < k) l = mid + 1;
    else if (mid > k) r = mid - 1;
    else return arr.slice(0, k);
  }
};

function shuffle(arr) {
  for (let i = arr.length; i; i--) {
    let random = Math.floor(Math.random() * i); //random [0,1)
    [arr[i - 1], arr[random]] = [arr[random], arr[i - 1]];
  }
  return arr;
}

function partition(arr, l, r) {
  let pivot = arr[l],
    index = l;
  for (let i = l + 1; i <= r; i++) {
    if (arr[i] < pivot) {
      ++index;
      [arr[i], arr[index]] = [arr[index], arr[i]];
    }
  }
  [arr[l], arr[index]] = [arr[index], arr[l]];
  return index;
}

//大根堆+小根堆 实现
const defaultCmp = (a, b) => a > b; // 默认是大根堆
const swap = (arr, i, j) => ([arr[i], arr[j]] = [arr[j], arr[i]]);

class Heap {
  constructor(cmp = defaultCmp) {
    this.container = [];
    this.cmp = cmp;
  }
  insert(data) {
    const {
      container,
      cmp
    } = this;
    container.push(data);
    let index = container.length - 1;
    while (index) {
      let parent = Math.floor((index - 1) / 2);
      if (cmp(container[parent], container[index])) return;
      swap(container, parent, index);
      index = parent;
    }
  }
  extract() {
    const {
      container,
      cmp
    } = this;
    if (!container.length) return null;
    swap(container, 0, container.length - 1);
    const res = container.pop(),
      len = container.length;
    let index = 0,
      exchange = index * 2 + 1;
    while (exchange < len) {
      // 以最大堆的情况来说：如果有右节点，并且右节点的值大于左节点的值
      let right = index * 2 + 2;
      if (right < len && cmp(container[right], container[exchange])) {
        exchange = right;
      }
      if (cmp(container[index], container[exchange])) break;
      swap(container, index, exchange);
      index = exchange;
      exchange = index * 2 + 1;
    }
    return res;
  }
  top() {
    if (this.container.length) return this.container[0];
    return null;
  }
}

//二分查找 查到新加入元素的插入点，如果直接加入再排序，时间复杂度O(NlogN)
//如何先用二分查找找到插入点，再移动的话，O(logN)+O(N) => O(N)
var addNum = function (arr, num) {
  if (!arr.length) {
    arr.push(num);
    return;
  }
  let l = 0,
    r = arr.length - 1;
  while (l <= r) {
    let mid = Math.floor(l + (r - l) / 2);
    if (arr[mid] === num) {
      arr.splice(mid, 0, num);
      return;
    } else if (arr[mid] < num) l = mid + 1;
    else r = mid - 1;
  }
  arr.splice(l, 0, num);
};


//归并排序 数组中的逆序对
var reversePairs = function (nums) {
  // 归并排序
  let sum = 0;
  mergeSort(nums);
  return sum;

  function mergeSort(nums) {
    if (nums.length < 2) return nums;
    const mid = parseInt(nums.length / 2);
    let left = nums.slice(0, mid);
    let right = nums.slice(mid);
    return merge(mergeSort(left), mergeSort(right));
  }

  function merge(left, right) {
    let res = [];
    let leftLen = left.length;
    let rightLen = right.length;
    let len = leftLen + rightLen;
    for (let index = 0, i = 0, j = 0; index < len; index++) {
      if (i >= leftLen) res[index] = right[j++];
      else if (j >= rightLen) res[index] = left[i++];
      else if (left[i] <= right[j]) res[index] = left[i++];
      else {
        res[index] = right[j++];
        sum += leftLen - i; //在归并排序中唯一加的一行代码
      }
    }
    return res;
  }
};

//树遍历非递归
var preorderTraversal = function (root) {
  if (!root) return [];
  const stack = [root],
    res = [];
  while (stack.length) {
    let node = stack.pop();
    res.push(node.val);
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
  return res;
};

var inorderTraversal = function (root) {
  if (!root) return [];
  let stack = [],
    res = [],
    cur = root;
  while (cur || stack.length) {
    while (cur) {
      stack.push(cur);
      cur = cur.left
    }
    let node = stack.pop();
    res.push(node.val);
    cur = node.right;
  }
  return res;
};

var postorderTraversal = function (root) {
  if (!root) return [];
  const stack = [root],
    res = [];
  while (stack.length) {
    let node = stack.pop();
    res.push(node.val);
    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }
  return res.reverse();
};

var postorderTraversal = function (root) {
  if (!root) return [];
  const stack = [root],
    res = [];
  let cur;
  while (stack.length) {
    let node = stack[stack.length - 1];
    if ((!node.left && !node.right) || node.left === cur || node.right === cur) {
      cur = stack.pop();
      res.push(cur.val);
    } else {
      if (node.right) stack.push(node.right);
      if (node.left) stack.push(node.left);
    }
  }
  return res;
};


//排序
//冒泡排序
function bubbleSort(arr) {
  if (!arr || arr.length < 2) return arr
  for (let end = arr.length - 1; end > 0; end--) {
    for (let i = 0; i < end; i++) {
      if (arr[i] > arr[i + 1]) swap(arr, i, i + 1)
    }
  }
}

function bubbleSort(arr) {
  if (!arr || arr.length < 2) return arr;
  let lastIndex = arr.length - 1;
  while (lastIndex > 0) { // 当最后一个交换的元素为第一个时，说明后面全部排序完毕
    let flag = true,
      k = lastIndex;
    for (let i = 0; i < k; i++) {
      if (arr[i] > arr[i + 1]) {
        flag = false;
        lastIndex = i; // 设置最后一次交换元素的位置
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
      }
    }
    if (flag) break;
  }
}

function swap(arr, i, j) {
  let temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}

//选择排序
function selectSort(arr) {
  if (!arr || arr.length < 2) return arr
  for (let i = 0; i < arr.length - 1; i++) {
    let min = i
    for (let j = i + 1; j < arr.length; j++) {
      min = arr[j] < arr[min] ? j : min
    }
    swap(arr, i, min)
  }
}

//插入排序
function insertSort(arr) {
  if (!arr || arr.length < 2) return arr;
  for (let i = 1; i < arr.length; i++) {
    let temp = arr[i],
      j = i;
    while (j - 1 >= 0 && arr[j - 1] > temp) {
      arr[j] = arr[j - 1];
      j--;
    }
    arr[j] = temp;
  }
}


//归并排序
function mergeSort(arr) {
  if (!arr || arr.length < 2) return arr;
  let mid = Math.floor(arr.length / 2),
    left = arr.slice(0, mid),
    right = arr.slice(mid);
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  let res = [],
    leftLen = left.length,
    rightLen = right.length,
    len = leftLen + rightLen;
  for (let index = 0, i = 0, j = 0; index < len; index++) {
    if (i >= leftLen) res[index] = right[j++];
    else if (j >= rightLen) res[index] = left[i++];
    else if (left[i] <= right[j]) res[index] = left[i++];
    else res[index] = right[j++];
  }
  return res;
}

//快速排序
function quickSort(arr, start, end) {
  if (!arr || arr.length < 2) return arr;
  if (start >= end) return;
  let index = partition(arr, start, end);
  quickSort(arr, start, index - 1);
  quickSort(arr, index + 1, end);
}

function partition(arr, l, r) {
  let privot = arr[l],
    index = l;
  for (let i = l + 1; i <= r; i++) {
    if (arr[i] < privot) {
      index++;
      [arr[index], arr[i]] = [arr[i], arr[index]];
    }
  }
  [arr[index], arr[l]] = [arr[l], arr[index]];
  return index;
}

//堆排序
const defaultCmp = (a, b) => a > b;
const swap = (arr, i, j) => ([arr[i], arr[j]] = [arr[j], arr[i]]);

class Heap {
  constructor(cmp = defaultCmp) {
    this.container = [];
    this.cmp = cmp;
  }
  insert(data) {
    const {
      container,
      cmp
    } = this;
    container.push(data);
    let index = container.length - 1;
    while (index) {
      let parent = Math.floor((index - 1) / 2);
      if (cmp(container[parent], container[index])) return;
      swap(container, parent, index);
      index = parent;
    }
  }
  extract() {
    const {
      container,
      cmp
    } = this;
    if (!container.length) return null;
    swap(container, 0, container.length - 1);
    const res = container.pop(),
      len = container.length;
    let index = 0,
      exchange = index * 2 + 1;
    while (exchange < len) {
      let right = index * 2 + 2;
      if (right < len && cmp(container[right], container[exchange])) {
        exchange = right;
      }
      if (cmp(container[index], container[exchange])) break;
      swap(container, index, exchange);
      index = exchange;
      exchange = index * 2 + 1;
    }
    return res;
  }
  top() {
    if (this.container.length) return this.container[0];
    return null;
  }
}

function heapSort(arr) {
  if (!arr || arr.length < 2) return arr;
  const res = [],
    heap = new Heap();
  for (let i = 0; i < arr.length; i++) {
    heap.insert(arr[i]);
  }
  while (heap.container.length) {
    res.unshift(heap.extract());
  }
  return res;
}