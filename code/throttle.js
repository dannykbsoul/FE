//1.拖拽场景：固定时间内只执行一次，防止超高频次触发位置变动
//2.缩放场景：监控浏览器resize
//3.动画场景：避免短时间内多次触发动画引起性能问题
//规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效。
// fn是我们需要包装的事件回调, interval是时间间隔的阈值
function throttle(fn, interval) {
  // last为上一次触发回调的时间
  let last = 0;
  // 将throttle处理结果当作函数返回
  return function (...args) {
    // 保留调用时的this上下文和记录本次触发回调的时间
    let context = this;
    now = +new Date();
    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
    if (now - last >= interval) {
      // 如果时间间隔大于我们设定的时间间隔阈值，则执行回调
      last = now;
      fn.apply(context, args);
    }
  }
}

// 用throttle来包装scroll的回调
const better_scroll = throttle(() => console.log('触发了滚动事件'), 1000)

document.addEventListener('scroll', better_scroll)

//throttle来优化debounce
//如果用户的操作十分频繁——他每次都不等 debounce 设置的 delay 时间结束就进行下一次操作，
//于是每次 debounce 都为该用户重新生成定时器，回调函数被延迟了不计其数次。
//频繁的延迟会导致用户迟迟得不到响应，用户同样会产生“这个页面卡死了”的观感。

// fn是我们需要包装的事件回调, delay是时间间隔的阈值
function throttle(fn, delay) {
  // last为上一次触发回调的时间, timer是定时器
  let last = 0,
    timer = null
  // 将throttle处理结果当作函数返回

  return function () {
    // 保留调用时的this上下文
    let context = this
    // 保留调用时传入的参数
    let args = arguments
    // 记录本次触发回调的时间
    let now = +new Date()

    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
    if (now - last < delay) {
      // 如果时间间隔小于我们设定的时间间隔阈值，则为本次触发操作设立一个新的定时器
      clearTimeout(timer)
      timer = setTimeout(function () {
        last = now
        fn.apply(context, args)
      }, delay)
    } else {
      // 如果时间间隔超出了我们设定的时间间隔阈值，那就不等了，无论如何要反馈给用户一次响应
      last = now
      fn.apply(context, args)
    }
  }
}

// 用新的throttle包装scroll的回调
const better_scroll = throttle(() => console.log('触发了滚动事件'), 1000)

document.addEventListener('scroll', better_scroll)

const throttle = (fn, interval) => {
  let last = 0;
  return (...args) => {
    let now = +new Date();
    if (now - last >= interval) {
      last = now;
      fn.apply(this, args);
    }
  }
}

const throttle = (fn, delay = 500) => {
  let flag = true;
  return (...args) => {
    if (!flag) return;
    flag = false;
    setTimeout(() => {
      fn.apply(this, args);
      flag = true;
    }, delay);
  };
};