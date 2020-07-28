//在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时。
// fn是我们需要包装的事件回调, delay是每次推迟执行的等待时间
function debounce(fn, delay) {
  // 定时器
  let timer = null;
  // 将debounce处理结果当作函数返回
  return function (...args) {
    // 保留调用时的this上下文
    let context = this;
    // 每次事件被触发时，都去清除之前的旧定时器
    if (timer) clearTimeout(timer);
    // 设立新定时器
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  }
}

// 用debounce来包装scroll的回调
const better_scroll = debounce(() => console.log('触发了滚动事件'), 1000)

document.addEventListener('scroll', better_scroll)


// 防抖函数
const debounce = (fn, delay) => {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};