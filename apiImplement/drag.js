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