//基于内置类原型扩展方法

//checkNum成为闭包中的私有函数，不会与全局的同名变量发生冲突
~ function anonymous(proto) {
  //为啥使用函数表达式的方式创建函数，主要是普通的function创建的话，存在变量提升，可以在函数声明之前调用函数，不符合逻辑思维
  const checkNum = function checkNum(num) {
    num = Number(num);
    //要保证num是有效数字
    return isNaN(num) ? 0 : num;
  }

  proto.plus = function plus(num) {
    //this 我们要操作的那个数字实例（对象）
    return this + checkNum(num);
  }
  proto.minus = function plus(num) {
    //this 我们要操作的那个数字实例（对象）
    return this - checkNum(num);
  }
}(Number.prototype)

let n = 10;
let m = n.plus(10).minus(5);
console.log(m); //=>15（10+10-5）