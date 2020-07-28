for (var i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i)
  }, 0)
}

//利用IIFE(立即执行函数表达式)当每次for循环时，把此时的i变量传递到定时器中
for (var i = 1; i <= 5; i++) {
  (function (j) {
    setTimeout(function timer() {
      console.log(j)
    }, 0)
  })(i)
}

//给定时器传入第三个参数, 作为timer函数的第一个函数参数
for (var i = 1; i <= 5; i++) {
  setTimeout(function timer(j) {
    console.log(j)
  }, 0, i)
}

//使用ES6中的let
for (let i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i)
  }, 0)
}