/**
 * async的执行原理
 * 其实就是自动执行generator函数
 * 暂时不考虑genertor的编译步骤（更复杂）
 */

const getData = () =>
  new Promise(resolve => setTimeout(() => resolve("data"), 1000))

// 这样的一个async函数 应该再1秒后打印data
async function test() {
  const data = await getData()
  console.log('data: ', data);
  const data2 = await getData()
  console.log('data2: ', data2);
  const data3 = await getData()
  console.log('data3: ', data3);
  const data4 = await getData()
  console.log('data4: ', data4);
  const data5 = await getData()
  console.log('data5: ', data5);
  return 'success'
}

// async函数会被编译成generator函数 (babel会编译成更本质的形态，这里我们直接用generator)
function* testG() {
  // await被编译成了yield
  const data = yield getData()
  console.log('data: ', data);
  const data2 = yield getData()
  console.log('data2: ', data2);
  const data3 = yield getData()
  console.log('data3: ', data3);
  const data4 = yield getData()
  console.log('data4: ', data4);
  const data5 = yield getData()
  console.log('data5: ', data5);
  return 'success'
}

function spawn(genF) {
  // 先调用generator函数 生成迭代器
  // 对应 const gen = testG()
  // 返回一个promise 因为外部是用.then的方式 或者await的方式去使用这个函数的返回值的
  // let test = asyncToGenerator(testG)
  // test().then(res => console.log(res))
  return new Promise((resolve, reject) => {
    const gen = genF();
    // 内部定义一个step函数 用来一步一步的跨过yield的阻碍
    // key有next和throw两种取值，分别对应了gen的next和throw方法
    // arg参数则是用来把promise resolve出来的值交给下一个yield
    function step(key, arg) {
      let res;
      // 这个方法需要包裹在try catch中
      // 如果报错了 就把promise给reject掉 外部通过.catch可以获取到错误
      try {
        res = gen[key](arg);
      } catch (e) {
        return reject(e);
      }
      // gen.next() 得到的结果是一个 { value, done } 的结构
      const {
        value,
        done
      } = res;
      if (done) {
        // 如果已经完成了 就直接resolve这个promise
        // 这个done是在最后一次调用next后才会为true
        // 以本文的例子来说 此时的结果是 { done: true, value: 'success' }
        // 这个value也就是generator函数最后的返回值
        return resolve(value);
      } else {
        // 除了最后结束的时候外，每次调用gen.next()
        // 其实是返回 { value: Promise, done: false } 的结构，
        // 这里要注意的是Promise.resolve可以接受一个promise为参数
        // 并且这个promise参数被resolve的时候，这个then才会被调用
        return Promise.resolve(
          // 这个value对应的是yield后面的promise
          value
        ).then(
          // value这个promise被resolve的时候，就会执行next
          // 并且只要done不是true的时候 就会递归的往下解开promise
          // 对应gen.next().value.then(value => {
          //    gen.next(value).value.then(value2 => {
          //       gen.next() 
          //
          //      // 此时done为true了 整个promise被resolve了 
          //      // 最外部的test().then(res => console.log(res))的then就开始执行了
          //    })
          // })
          (val) => {
            step("next", val);
          },
          // 如果promise被reject了 就再次进入step函数
          // 不同的是，这次的try catch中调用的是gen.throw(err)
          // 那么自然就被catch到 然后把promise给reject掉啦
          (e) => {
            step("throw", e);
          },
        )
      }
    }
    step("next");
  })
}

spawn(testG).then(result => {
  console.log(result)
})


//继发与并发
//给定一个 URL 数组，如何实现接口的继发和并发？

// 继发一
async function loadData() {
  var res1 = await fetch(url1);
  var res2 = await fetch(url2);
  var res3 = await fetch(url3);
  return "whew all done";
}

// 继发二
async function loadData(urls) {
  for (const url of urls) {
    const response = await fetch(url);
    console.log(await response.text());
  }
}

// 并发一
async function loadData() {
  var res = await Promise.all([fetch(url1), fetch(url2), fetch(url3)]);
  return "whew all done";
}

// 并发二
async function loadData(urls) {
  // 并发读取 url
  const textPromises = urls.map(async url => {
    const response = await fetch(url);
    return response.text();
  });

  // 按次序输出
  for (const textPromise of textPromises) {
    console.log(await textPromise);
  }
}