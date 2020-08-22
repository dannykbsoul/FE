// 拖拽
const ball = document.getElementById('ball');

let startDrag = false;

ball.addEventListener('mousedown', () => {
    startDrag = true;
});
//将mousemove事件绑定到了元素本身，这意味着当鼠标移出元素所占据的范围的时候，元素会停止移动。这就是小球突然停顿的原因。
document.addEventListener('mousemove', (e) => {
    if (!startDrag) return;
    let x = e.pageX - ball.offsetWidth / 2;
    let y = e.pageY - ball.offsetHeight / 2;
    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;
});

ball.addEventListener('mouseup', () => {
    startDrag = false;
});

// 懒加载
const imgs = document.getElementsByTagName('img')
// 获取可视区域的高度
const viewHeight = window.innerHeight || document.documentElement.clientHeight

function lazyload() {
    for (let i = 0, len = imgs.length; i < len; i++) {
        // 用可视区域高度减去元素顶部距离可视区域顶部的高度
        let distance = viewHeight - imgs[i].getBoundingClientRect().top
        // 如果可视区域高度大于等于元素顶部距离可视区域顶部的高度，说明元素露出
        if (distance >= 0) {
            // 给元素写入真实的src，展示图片
            imgs[i].src = imgs[i].getAttribute('data-src')
        }
    }
}
lazyload();
// 监听Scroll事件
window.addEventListener('scroll', lazyload, false);