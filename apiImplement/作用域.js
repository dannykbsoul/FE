var b = 10; // 报错 
function b() {
  b = 20;
  console.log(b);
}
b(); //b is not a function

var b = 10;
(function b(b) {
  b = 20;
  console.log(b);
})() //20

var b = 10;
(function b() {
  var b = 20;
  console.log(b);
})() //20

var b = 10;
(function a(b) {
  b = 20;
  console.log(b);
})() //20

function b() {
  alert(0)
}
(function b() {
  b()
  console.log(b);
})() //死循环


var a = 10;
(function () {
  console.log(a)
  a = 5
  console.log(window.a)
  var a = 20;
  console.log(a)
})() //undefined->10->20