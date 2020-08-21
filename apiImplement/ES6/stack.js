//实现栈结构
const Stack = (() => {
    const wm = new WeakMap();
    class Stack {
        constructor() {
            wm.set(this, []);
        }
        push(...nums) {
            let list = wm.get(this);
            list.splice(list.length, 0, ...nums);
            return list.length;
        }
        pop() {
            let list = wm.get(this);
            return list.splice(list.length - 1, 1)[0];
        }

        peek() {
            let list = wm.get(this);
            return list[list.length - 1];
        }
        clear() {
            let list = wm.get(this);
            list.length = 0;
        }
        size() {
            return this.length;
        }
        output() {
            return wm.get(this);
        }
        isEmpty() {
            return wm.get(this).length === 0;
        }
    }
    return Stack;
})()

let s = new Stack()

s.push(1, 2, 3, 4, 5)
console.log(s.output()) // [ 1, 2, 3, 4, 5 ]
s.push(6, 7);
console.log(s.pop());
console.log(s);
console.log(s.peek());
console.log(s);
console.log(s.size());
console.log(s.isEmpty());
s.clear();
console.log(s.isEmpty());