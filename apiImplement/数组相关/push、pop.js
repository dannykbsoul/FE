//push
Array.prototype.push2 = function (...rest) {
    this.splice(this.length, 0, ...rest)
    return this.length;
}

//pop
Array.prototype.pop2 = function () {
    return this.splice(this.length - 1, 1)[0];
}

// 类数组
//可以看出push会添加索引为length的属性，如果已经存在，那么会覆盖
let obj = {
    '1': 'a',
    '2': 'b',
    length: 2,
    push: Array.prototype.push
};

// Array.prototype.push.call(obj, 'c');
obj.push('c')

console.log(obj); // { '1': 'a', '2': 'c', length: 3 }


//字符串repeat实现
// 原生repeat
'ni'.repeat(3); // 'ninini'

// 实现一
String.prototype.repeatString1 = function (n) {
    return Array(n + 1).join(this);
}
console.log('ni'.repeatString1(3));

// 实现二
String.prototype.repeatString2 = function (n) {
    return Array(n).fill(this).join('');
}
console.log('ni'.repeatString2(3));