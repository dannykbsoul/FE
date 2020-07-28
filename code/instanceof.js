function myInstanceof(left, right) {
  let proto = Object.getPrototypeOf(left);
  while (true) {
    if (proto == null) return false;
    if (proto == right.prototype) return true;
    proto = Object.getPrototypeof(proto);
  }
}

//Symbol.hasInstance可以自定义instanceof的行为
class PrimitiveString {
  static[Symbol.hasInstance](x) {
    return typeof x === 'string'
  }
}
console.log('hello world'
  instanceof PrimitiveString) // true

// 模拟 instanceof
function instance_of(L, R) {
  //L 表示左表达式，R 表示右表达式
  var O = R.prototype; // 取 R 的显示原型
  L = L.__proto__; // 取 L 的隐式原型
  while (true) {
    if (L === null) return false;
    if (O === L)
      // 这里重点：当 O 严格等于 L 时，返回 true
      return true;
    L = L.__proto__;
  }
}