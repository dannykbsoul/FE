let fn1 = function (x) {
    return x + 10;
};
let fn2 = function (x) {
    return x * 10;
};
let fn3 = function (x) {
    return x / 10;
};


function compose(...funcs) {
    if (funcs.length === 0) {
        return arg => arg
    }

    if (funcs.length === 1) {
        return funcs[0]
    }

    return funcs.reduce((a, b) => (...args) => b(a(...args)))
}
console.log(compose(fn1, fn2, fn3)(10))

/**
 * 
 * @param {*} fn 
 * @param {*} length 
 * 1. 传参个数固定的curry
 */
function currying(fn, length) {
    return function (...args) {
        if (args.length >= length) return fn(...args);
        return currying(fn.bind(null, ...args), length - args.length)
    }
}

let add = currying(function (...args) {
    return args.reduce((x, y) => x + y)
}, 4)
console.log(add(1, 2)(3, 4));
console.log(add(1)(2)(3, 4));
console.log(add(1)(2)(3)(4));

/**
 * 
 * @param {*} fn 
 * 2. 参数不固定，但是当函数执行的时候没有传参开始执行
 */
function currying(fn) {
    return function (...args) {
        if (args.length === 0) return fn(...args);
        return currying(fn.bind(null, ...args));
    }
}

let count = currying(function (...rest) {
    return rest.reduce((prev, cur) => prev + cur, 0);
});

console.log(count(100)(200)(10)()); // 310
console.log(count(100)(10)()); // 110

/**
 * 
 * @param {*} fn 
 * 3. 参数不固定，当alert()的时候开始执行，因为类型转换的关系调用toString()
 */
function currying(fn) {
    const inner = function (...args) {
        return currying(fn.bind(null, ...args));
    }
    inner.toString = () => fn();
    return inner;
}

let count = currying(function (...rest) {
    return rest.reduce((prev, cur) => prev + cur, 0);
});

count(100)(200)(10).toString(); // 310
count(100)(10).toString(); // 110
count(100, 200)(10).toString(); // 310

/**
 * 
 * @param {*} fn 
 * @param {*} times 
 * 4. 指定执行的次数，次数够了开始执行
 */
function currying(fn, times) {
    return function (...args) {
        if (--times === 0) return fn(...args);
        return currying(fn.bind(null, ...args), times);
    }
}

let count = currying(function (...rest) {
    return rest.reduce((prev, cur) => prev + cur, 0);
}, 3);

console.log(count(100)(200)(10)); // 310
console.log(count(100, 100)(200)(10)); // 410

/**
 * 
 * @param {*} fn 
 * @param {*} times 
 * 5. 指定执行的次数，次数够了开始执行
 */
function currying(fn, times = 1) {
    let params = [];
    return function (...rest) {
        params = [...params, ...rest];
        if (--times === 0) {
            return fn.apply(null, params);
        }
    }
}
let newFn = currying(function (...rest) {
    return rest.reduce((prev, cur) => prev + cur, 0);
}, 3); // 执行3次 内部fn才会执行
newFn(2, 6, 7);
newFn(3);
console.log(newFn(4));