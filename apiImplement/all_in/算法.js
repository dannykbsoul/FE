//js创建链表
var arr = [1, 2, 3, 4, 5, 6];

class Node {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}
//根据数组创建一个链表
function createLinkedList(arr) {
    if (arr.length === 0) return null;
    let head = new Node(arr[0]),
        cur = head;
    for (let i = 1, len = arr.length; i < len; i++) {
        cur.next = new Node(arr[i]);
        cur = cur.next;
    }
    cur.next = null;
    return head;
}
//遍历链表
function printLinkedList(head) {
    let cur = head;
    while (cur) {
        console.log(cur.val);
        cur = cur.next;
    }
}
// let head = createLinkedList(arr);
// printLinkedList(head);

function bubbleSort(arr) {
    if (!Array.isArray(arr) || arr.length <= 1) return;
    let lastIndex = arr.length - 1;
    while (lastIndex > 0) { // 当最后一个交换的元素为第一个时，说明后面全部排序完毕
        let flag = true, k = lastIndex;
        for (let j = 0; j < k; j++) {
            if (arr[j] > arr[j + 1]) {
                flag = false;
              	lastIndex = j; // 设置最后一次交换元素的位置
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
            }
        }
      	if (flag) break;
    }
}

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
      // [array[i], array[minIndex]] = [array[minIndex], array[i]];
      swap(array, i, minIndex);
    }
  
    return array;
  }
  
  // 交换数组中两个元素的位置
  function swap(array, left, right) {
    var temp = array[left];
    array[left] = array[right];
    array[right] = temp;
  }

  