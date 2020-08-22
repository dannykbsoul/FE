// 数组相关

// 数组转化为树
const arr = [{
        id: 4,
        parent_id: null
    }, {
        id: 7,
        parent_id: 4
    }, {
        id: 2,
        parent_id: 4
    }, {
        id: 1,
        parent_id: 7
    },
    {
        id: 3,
        parent_id: 7
    }
]


function convertArrToTree(arr) {
    let map = new Map(),
        root;

    arr.forEach((item) => {
        map.set(item.id, item);
        item.children = [];
    })
    arr.forEach((item) => {
        if (item.parent_id) {
            let obj = map.get(item.parent_id);
            obj.children.push(map.get(item.id));
        } else root = item.id;
    })
    return map.get(root);
}
convertArrToTree(arr);
const tree = {
    id: 4,
    parent_id: null,
    children: [{
        id: 7,
        parent_id: 4,
        children: [{
            id: 1,
            parent_id: 7,
            children: []
        }, {
            id: 3,
            parent_id: 7,
            children: []
        }]
    }, {
        id: 2,
        parent_id: 4,
        children: []
    }]
}

function flatten1(arr) {
    let res = [];
    for (let i = 0, len = arr.length; i < len; i++) {
        if (Array.isArray(arr[i])) res.push(...flatten1(arr[i]));
        else res.push(arr[i]);
    }
    return res;
}

function flatten2(arr) {
    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr);
    }
    return arr;
}

function flatten3(arr) {
    return arr.reduce((pre, cur) => {
        return pre.concat(Array.isArray(cur) ? flatten3(cur) : cur);
    }, []);
}

function flatten4(arr) {
    return arr.toString().split(',').map(item => +item);
}

function flatten5(arr, depth) {
    return arr.flat(depth);
}

//缺点 对象和NaN无法去重
function unique1(arr) {
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

// indexOf
function unique2(arr) {
    let res = [];
    for (let i = 0, len = arr.length; i < len; i++) {
        if (res.indexOf(arr[i]) === -1) {
            res.push(arr[i]);
        }
    }
    return res;
}

// sort
// 无法去重对象和NaN以及数字1这些情况
function unique3(arr) {
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

// filter+indexOf
// 对象无法去重，NaN直接会被忽略，因为indexOf底层用了===
function unique4(arr) {
    return arr.filter((item, index, array) => {
        return array.indexOf(item) === index;
    });
}

// filter+sort
// 无法去重NaN和对象以及数字1的情况
function unique5(arr) {
    return arr
        .concat()
        .sort()
        .filter((item, index, array) => {
            return !index || item !== array[index - 1];
        });
}

// object键值对
function unique(arr) {
    let obj = {};
    return arr.filter((item, index, arr) => {
        return obj.hasOwnProperty(typeof item + JSON.stringify(item)) ?
            false :
            (obj[typeof item + JSON.stringify(item)] = true);
    });
}

// es6
// 对象不去重，NaN去重
function unique7(arr) {
    return Array.from(new Set(arr)); //Array.from将可迭代对象转换成数组
}

// 对象不去重，NaN去重
function unique8(arr) {
    const seen = new Map();
    return arr.filter((item, index, arr) => {
        return !seen.has(item) && seen.set(item, 1);
    });
}

// 乱序
arr.slice().sort(() => {
    return Math.random() - 0.5;
});

function shuffle(arr) {
    for (let i = arr.length; i; i--) {
        let random = Math.floor(Math.random() * i);
        [arr[i - 1], arr[random]] = [arr[random], arr[i - 1]];
    }
    return arr;
}

//Math.max()

//reduce
function max(arr) {
    return arr.reduce((pre, cur, index, arr) => {
        return pre > cur ? pre : cur;
    })
}
console.log(max([1, 2, 5, 3, 1]));

//es6
let arr = [1, 2, 3];
Math.max(...arr);

//apply
Math.max.apply(null, arr);

//eval
let max1 = eval("Math.max(" + arr + ")")
console.log(max1);

//push
Array.prototype.push2 = function (...rest) {
    this.splice(this.length, 0, ...rest)
    return this.length;
}

//pop
Array.prototype.pop2 = function () {
    return this.splice(this.length - 1, 1)[0];
}

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

Array.prototype.MyMap1 = function (fn, context) {
    const arr = this;
    return arr.reduce((pre, cur, index, arr) => {
        pre.push(fn.call(context, cur, index, arr));
        return pre;
    }, []);
}

Array.MyIsArray = function (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
};

const isComplexDataType = (obj) => (typeof obj === 'object' && obj !== null);
const deepClone = function (obj, hash = new WeakMap()) {
    if (hash.has(obj)) return hash.get(obj);
    const type = [RegExp, Date, Set, Map, WeakSet, WeakMap];
    if (type.includes(obj.constructor)) return new obj.constructor(obj);
    let allDesc = Object.getOwnPropertyDescriptors(obj);
    let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc);
    hash.set(obj, cloneObj);
    for (let key of Reflect.ownKeys(obj)) {
        cloneObj[key] = isComplexDataType(obj[key]) ? deepClone(obj[key], hash) : obj[key];
    }
    return cloneObj;
}

function Son(name) {
    this.name = name;
}
Son.prototype.age = 18;
let mysymbol = Symbol(1);

const obj4 = {
    b: new Set([1]),
    a: function fn1() {
        console.log(777)
    },
    c: () => {},
    d: new RegExp(),
    e: new Date(),
    g: new Son('zj'),
    [mysymbol]: 1
};
let newA = deepClone(obj4);
obj4.b.add(12);
console.log(obj4)
console.log(newA)
console.log(newA['g'] === obj4['g'])
console.log(obj4.a());
console.log(newA.a());