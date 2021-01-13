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

let box = document.querySelector('.box'),
    HTML = document.documentElement,
    minL = 0,
    minT = 0,
    maxL = HTML.clientWidth - box.offsetWidth,
    maxT = HTML.clientHeight - box.offsetHeight;

// 鼠标按下开始拖拽
const down = function down(ev) {
    // 记录鼠标开始位置和盒子的开始位置：这些信息蔚来会在鼠标移动的
    // 方法中使用(把盒子挂载到盒子的自定义属性上，后期在其他的方法中只要获取到当前盒子，就可以获取到记录的这些开始信息了)
    // this -> box
    let {
        top,
        left
    } = this.getBoundingClientRect();
    this.startT = top;
    this.startL = left;
    this.startX = ev.clientX;
    this.startY = ev.clientY;

    //this.setCapture();
    // 鼠标按下才能进行鼠标移动和抬起的事件绑定
    // 注意⚠️ 保证move/up中的this还需要是盒子，并且还要考虑移除的时候如何移除
    this._move = move.bind(this);
    this._up = up.bind(this);
    window.addEventListener('mousemove', this._move);
    window.addEventListener('mouseup', this._up);
}
   
// 鼠标移动拖拽中
const move = function move(ev) {
    // 获取盒子当前的位置
    let curL = ev.clientX-this.startX+this.startL,
        curT = ev.clientY-this.startY+this.startT;
    
    // 边界判断
    curL = curL < minL ? minL : (curL>maxL?maxL:curL);
    curT = curT < minT ? minT : (curT>maxT?maxT:curT);

    // 修改样式
    this.style.left = `${curL}px`;
    this.style.right = `${curT}px`;
}

// 鼠标抬起
const up = function up(ev) {
    // this.releaseCapture();
    // 移除事件绑定来结束拖拽
    window.removeEventListener('mousemove', this._move);
    window.removeEventListener('mouseup', this._up);
}

box.addEventListener('mousedown', down);

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