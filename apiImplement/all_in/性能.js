function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
        if (timer) clearTimeout(timer);
        // let context = this;
        // // 此时里面函数的this指向是window，所以我们要改变this指向
        // timer = setTimeout(function () {
        //     fn.apply(context, ...args);
        // }, delay);
        timer = setTimeout(() => {
            fn.call(this, ...args);
        }, delay);
    }
}
// 用debounce来包装scroll的回调
const better_scroll = debounce(() => console.log('触发了滚动事件'), 1000);
document.addEventListener('scroll', better_scroll);

function throttle(fn, interval) {
    let last = 0;
    return function (...args) {
        let now = +new Date();
        if (now - last >= interval) {
            last = now;
            fn(...args);
        }
    }
}