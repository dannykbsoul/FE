// function getType(target) {
//   if (target === null) return 'null';
//   if (typeof target !== 'object') return typeof target;
//   const template = {
//     "[object Object]": 'object',
//     "[object Array]": 'array',
//     "[object String]": 'object-string',
//     "[object Number]": 'object-number'
//   }
//   const type = Object.prototype.toString.call(target);
//   return template[type];
// }

// console.log(getType(new String('123')));

var class2type = {};
var toString = class2type.toString; //=>Object.prototype.toString
var hasOwn = class2type.hasOwnProperty; //=>Object.prototype.hasOwnProperty
var fnToString = hasOwn.toString; //=>Function.prototype.toString
var ObjectFunctionString = fnToString.call(Object); //"function Object() { [native code] }"

"Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ").forEach(function anonymous(name) {
    class2type["[object " + name + "]"] = name.toLowerCase();
});

function toType(obj) {
    //obj may be null/undefined
    //return "null"/"undefined"
    //在 IE6 中，null 和 undefined 会被 Object.prototype.toString 识别成 [object Object]！
    if (obj == null) {
        return obj + "";
    }
    return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
}

/*================*/
//检测是否为window对象 window.window===window
var isWindow = function isWindow(obj) {
    return obj != null && obj === obj.window;
};

//是否为纯粹的对象
var isPlainObject = function isPlainObject(obj) {
    var proto, Ctor;
    if (!obj || toString.call(obj) !== "[object Object]") {
        return false;
    }
    proto = Object.getPrototypeOf(obj);
    // Objects with no prototype (`Object.create( null )`)
    if (!proto) {
        return true;
    }
    // Objects with prototype are plain iff they were constructed by a global Object function
    //proto.hasOwnProperty("constructor")
    //如果有constructor属性，就用proto.constructor获取它的constructor
    //如果没有constructor属性，就返回false
    Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
    return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
};

//是否是空对象
var isEmptyObject = function isEmptyObject(obj) {
    var name;
    for (name in obj) {
        return false;
    }
    return true;
};

//是否为数组、类数组
var isArrayLike = function isArrayLike(obj) {
    var length = !!obj && "length" in obj && obj.length,
        type = toType(obj);
    if (isFunction(obj) || isWindow(obj)) {
        return false;
    }
    return type === "array" || length === 0 || typeof length === "number" && length > 0 && (length - 1) in obj;
};

//if (a == 1 & a == 2 & a == 3)

//方法一
var a = {
    a: 1,
    toString() {
        return this.a++
    }
}

if (a == 1 && a == 2 && a == 3) {
    console.log('OK');
}

//方法二
var a = [1, 2, 3];
a.toString = a.shift;

//方法三 Object.defineProperty
var i = 1;
Object.defineProperty(window, 'a', {
    get() {
        return i++;
    }
})


var obj = {
    '2': 3,
    '3': 4,
    'length': 2,
    'splice': Array.prototype.splice,
    'push': Array.prototype.push
}
obj.push(1)
obj.push(2)
console.log(obj) //Object(4) [empty × 2, 1, 2, splice: ƒ, push: ƒ]

var a = {
    n: 1
};
var b = a;
a.x = a = {
    n: 2
};

console.log(a.x) // undefined
console.log(b.x) // {n:2}


// example 1
var a = {},
    b = '123',
    c = 123;
a[b] = 'b';
a[c] = 'c';
console.log(a[b]); //c

// example 2
var a = {},
    b = Symbol('123'),
    c = Symbol('123');
a[b] = 'b';
a[c] = 'c';
console.log(a[b]); //b

// example 3
var a = {},
    b = {
        key: '123'
    },
    c = {
        key: '456'
    };
a[b] = 'b';
a[c] = 'c';
console.log(a[b]); //c

function changeObjProperty(o) {
    o.siteUrl = "http://www.baidu.com"
    o = new Object()
    o.siteUrl = "http://www.google.com"
}
let webSite = new Object();
changeObjProperty(webSite);
console.log(webSite.siteUrl); //http://www.baidu.com


function Foo() {
    Foo.a = function () {
        console.log(1)
    }
    this.a = function () {
        console.log(2)
    }
}
// 以上只是 Foo 的构建方法，没有产生实例，此刻也没有执行
Foo.prototype.a = function () {
    console.log(3)
}
// 现在在 Foo 上挂载了原型方法 a ，方法输出值为 3
Foo.a = function () {
    console.log(4)
}
// 现在在 Foo 上挂载了直接方法 a ，输出值为 4
Foo.a();
// 立刻执行了 Foo 上的 a 方法，也就是刚刚定义的，所以
// # 输出 4
let obj = new Foo();
/* 这里调用了 Foo 的构建方法。Foo 的构建方法主要做了两件事：
1. 将全局的 Foo 上的直接方法 a 替换为一个输出 1 的方法。
2. 在新对象上挂载直接方法 a ，输出值为 2。
*/

obj.a();
// 因为有直接方法 a ，不需要去访问原型链，所以使用的是构建方法里所定义的 this.a，
// # 输出 2

Foo.a();
// 构建方法里已经替换了全局 Foo 上的 a 方法，所以
// # 输出 1


String('11') == new String('11'); // true
String('11') === new String('11'); // false

var name = 'Tom';
(function () {
    console.log(name); // undefined
    if (typeof name == 'undefined') {
        var name = 'Jack';
        console.log('Goodbye ' + name);
    } else {
        console.log('Hello ' + name);
    }
})(); //Goodbye Jack

var name = 'Tom';
(function () {
    console.log(name); // 'Tom'
    if (typeof name == 'undefined') {
        name = 'Jack';
        console.log('Goodbye ' + name);
    } else {
        console.log('Hello ' + name);
    }
})(); //Hello Tom

1 + "1" // "11"

2 * "2" // 4

[1, 2] + [2, 1] //"1,22,1"

"a" + +"b" //"aNaN"

for (var i = 1; i <= 5; i++) {
    setTimeout(function timer() {
        console.log(i)
    }, 0)
}

//利用IIFE(立即执行函数表达式)当每次for循环时，把此时的i变量传递到定时器中
for (var i = 1; i <= 5; i++) {
    (function (j) {
        setTimeout(function timer() {
            console.log(j)
        }, 0)
    })(i)
}

//给定时器传入第三个参数, 作为timer函数的第一个函数参数
for (var i = 1; i <= 5; i++) {
    setTimeout(function timer(j) {
        console.log(j)
    }, 0, i)
}

//使用ES6中的let
for (let i = 1; i <= 5; i++) {
    setTimeout(function timer() {
        console.log(i)
    }, 0)
}