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