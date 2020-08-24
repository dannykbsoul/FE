class Promise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    let resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.onResolvedCallbacks.forEach(fn => fn());
      }
    }
    let reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    }
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : err => {
      throw err
    };
    let promise2 = new Promise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0)
      }
      if (this.state === 'rejected') {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0)
      }
      if (this.state === 'pending') {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0)
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0)
        })
      }
    })
    return promise2;
  }
  catch (fn) {
    return this.then(null, fn);
  }
  done(onFulfilled, onRejected) {
    this.then(onFulfilled, onRejected)
      .catch(function (reason) {
        //抛出一个全局错误
        setTimeout(() => {
          throw reason;
        }, 0)
      })
  }
  finally(cb) {
    this.then(value => {
      return Promise.resolve(cb()).then(() => {
        return value;
      })
    }, error => {
      return Promise.resolve(cb()).then(() => {
        throw error;
      })
    })
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (x === promise2) reject(new TypeError());
  let called;
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      let then = x.then;
      if (typeof then === 'function') {
        then.call(x, y => {
          // ?为啥这地方要加called
          if (called) return;
          called = true;
          resolvePromise(promise2, y, resolve, reject);
        }, e => {
          if (called) return;
          called = true;
          reject(e);
        })
      } else {
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}

Promise.resolve = function (val) {
  if (val instanceof Promise) return val;
  return new Promise((resolve, reject) => {
    if (val && val.then && typeof val.then === 'function') {
      //？
      val.then(resolve, reject);
    }
    resolve(val);
  })
}

Promise.reject = function (val) {
  return new Promise((resolve, reject) => {
    reject(val);
  })
}

Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0, len = promises.length; i < len; i++) {
      Promise.resolve(promises[i]).then(resolve, reject);
    }
  })
}

Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    let resArr = [],
      count = 0,
      len = promises.length;

    for (let i = 0; i < len; i++) {
      Promise.resolve(promises[i]).then(val => {
        resArr[i] = val;
        count++;
        if (count === len) return resolve(resArr);
      }, e => {
        reject(e);
      })
    }
  })
}

Promise.defer = Promise.deferred = function () {
  let dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}

module.exports = Promise;

//promises-aplus-tests promise.js

// 通常我们在需要保证代码在多个异步处理之后执行，会用到Promise.all()
// Promise.all可以保证，promises数组中所有promise对象都达到resolve状态，才执行then回调。
// 这时候考虑一个场景：如果你的promises数组中每个对象都是http请求，或者说每个对象包含了复杂的调用处理。而这样的对象有几十万个。
// 那么会出现的情况是，你在瞬间发出几十万http请求（tcp连接数不足可能造成等待），或者堆积了无数调用栈导致内存溢出。
// 这时候，我们就需要考虑对Promise.all做并发限制。