// 要求任务并行完成，同时并行的任务不能超过两个。
class Schedule {
    add(promiseCreator) {}
}


// 实现一个 sleep 函数 比如 sleep(1000) 意味着等待 1000 毫秒，可从 Promise、Generator、Async/Await 等角度实现
// promise
const sleep1 = time => {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    })
}
sleep1(1000).then(() => console.log(1));

//generator
function* sleep2(time) {
    yield new Promise((resolve) => {
        setTimeout(resolve, time)
    })
}
sleep2(1000).next().value.then(() => {
    console.log(1)
});

//async await
async function sleep3(time, func) {
    await new Promise(resolve => setTimeout(resolve, time))
    return func()
}
sleep3(1000, () => {
    console.log(1)
})

//cb
function sleep4(time, cb) {
    setTimeout(cb, time);
}

sleep4(1000, () => {
    console.log(1)
});

// 输出顺序
console.log("begin");
setTimeout(() => {
    console.log("setTimeout1");

    Promise.resolve()
        .then(() => {
            console.log("promise1");
            setTimeout(() => {
                console.log("setTimeout2");
            });
        })
        .then(() => {
            console.log("promise2");
        });

    new Promise((resolve) => {
        console.log("a");
        setTimeout(() => {
            console.log("setTimeout3");
            resolve();
        });
    }).then(() => {
        console.log("b");
    });
}, 0);
console.log("end");
// beigin end setTimeout1 a promise1 promise2 setTimeout3 b setTimeout2


// 完成repeat函数
function repeat(func, times, wait) {}
// 输入
const repeatFunc = repeat(alert, 4, 3000);

// 输出
// 会alert4次 helloworld, 每次间隔3秒
repeatFunc("hellworld");
// 会alert4次 worldhellp, 每次间隔3秒
repeatFunc("worldhello");

// 解答
async function wait(seconds) {
    return new Promise((res) => {
        setTimeout(res, seconds);
    });
}

function repeat(func, times, s) {
    return async function (...args) {
        for (let i = 0; i < times; i++) {
            func.apply(null, args);
            await wait(s);
        }
    };
}

let log = console.log;
let repeatFunc = repeat(log, 4, 3000);
repeatFunc("HelloWorld");
repeatFunc("WorldHello");


// async执行顺序
async function async1() {
    console.log("async1 start"); // 2
    await async2();
    console.log("async1 end"); // 6
}

async function async2() {
    console.log("async2"); // 3
}

console.log("script start"); //  1

setTimeout(function () {
    console.log("setTimeout"); // 8
}, 0);

async1();

new Promise(function (resolve) {
    console.log("promise1"); // 4
    resolve();
}).then(function () {
    console.log("promise2"); // 7
});

console.log("script end"); // 5

// 如何串行调用promises

// 1. 递归执行
function iteratorPromise(arr) {

    (function iter() {
        if (arr.length)
            arr.shift()().then(iter)
    })()
}

let arr = [() => {
    return new Promise(res => {
        console.log("run", Date.now());
        res()
    })
}, () => {
    return new Promise(res => {
        console.log("run", Date.now());
        res()
    })
}, () => {
    return new Promise(res => {
        console.log("run", Date.now());
        res()
    })
}]

iteratorPromise(arr);

// 2.迭代执行
function iteratorPromise(arr) {

    let res = Promise.resolve();

    arr.forEach(fn => {
        res = res.then(() => fn()) // 关键是 res=res.then... 这个逻辑
    })
}

let arr = [() => {
    return new Promise(res => {
        setTimeout(() => {
            console.log("run", Date.now());
            res()
        }, 1000)

    })
}, () => {
    return new Promise(res => {
        setTimeout(() => {
            console.log("run", Date.now());
            res()
        }, 1000)

    })
}, () => {
    return new Promise(res => {
        setTimeout(() => {
            console.log("run", Date.now());
            res()
        }, 1000)

    })
}]

iteratorPromise(arr);


// Promise内置的all、race都是并行的
let arr = [
    new Promise(res => {
        setTimeout(() => {
            console.log("run", Date.now());
            res()
        }, 1000)

    }), new Promise(res => {
        setTimeout(() => {
            console.log("run", Date.now());
            res()
        }, 1000)

    }), new Promise(res => {
        setTimeout(() => {
            console.log("run", Date.now());
            res()
        }, 1000)

    })
]
Promise.all(arr)

function wait() {
    return new Promise(resolve =>
        setTimeout(resolve, 10 * 1000)
    )
}

async function main() {
    console.time();
    const x = wait();
    const y = wait();
    const z = wait();
    await x;
    await y;
    await z;
    console.timeEnd();
}
main();
//new Promise(xx)相当于同步任务, 会立即执行
//所以: x,y,z 三个任务是几乎同时开始的, 最后的时间依然是10*1000ms (比这稍微大一点点, 超出部分在1x1000ms之内)


console.log(1);
setTimeout(_ => {
    console.log(2);
}, 1000);
async function fn() {
    console.log(3);
    setTimeout(_ => {
        console.log(4);
    }, 20);
    return Promise.reject();
}
async function run() {
    console.log(5);
    await fn();
    console.log(6);
}
run();
// 需要执行150MS左右
for (let i = 0; i < 90000000; i++) {}
setTimeout(_ => {
    console.log(7);
    new Promise(resolve => {
        console.log(8);
        resolve();
    }).then(_ => {
        console.log(9);
    });
}, 0);
console.log(10);
//1 5 3 10 4 7 8 9 2