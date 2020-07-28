// function getType(target) {
//   if (target === null) return 'null';
//   if (typeof target !== 'object') return typeof target;
//   const template = {
//     "[object Object]": 'object',
//     "[object Array]": 'array',
//     "[object String]": 'object-string',
//     "[object Number]": 'object-number'
//   }
//   const type = Object.prototype.toString.call(target);
//   return template[type];
// }

// console.log(getType(new String('123')));

var class2type = {};
var toString = class2type.toString; //=>Object.prototype.toString
var hasOwn = class2type.hasOwnProperty; //=>Object.prototype.hasOwnProperty
var fnToString = hasOwn.toString; //=>Function.prototype.toString
var ObjectFunctionString = fnToString.call(Object); //"function Object() { [native code] }"

"Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ").forEach(function anonymous(name) {
  class2type["[object " + name + "]"] = name.toLowerCase();
});

function toType(obj) {
  //obj may be null/undefined
  //return "null"/"undefined"
  //在 IE6 中，null 和 undefined 会被 Object.prototype.toString 识别成 [object Object]！
  if (obj == null) {
    return obj + "";
  }
  return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
}

/*================*/
//检测是否为window对象 window.window===window
var isWindow = function isWindow(obj) {
  return obj != null && obj === obj.window;
};

//是否为纯粹的对象
var isPlainObject = function isPlainObject(obj) {
  var proto, Ctor;
  if (!obj || toString.call(obj) !== "[object Object]") {
    return false;
  }
  proto = Object.getPrototypeOf(obj);
  // Objects with no prototype (`Object.create( null )`)
  if (!proto) {
    return true;
  }
  // Objects with prototype are plain iff they were constructed by a global Object function
  //proto.hasOwnProperty("constructor")
  //如果有constructor属性，就用proto.constructor获取它的constructor
  //如果没有constructor属性，就返回false
  Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
  return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
};

//是否是空对象
var isEmptyObject = function isEmptyObject(obj) {
  var name;
  for (name in obj) {
    return false;
  }
  return true;
};

//是否为数组、类数组
var isArrayLike = function isArrayLike(obj) {
  var length = !!obj && "length" in obj && obj.length,
    type = toType(obj);
  if (isFunction(obj) || isWindow(obj)) {
    return false;
  }
  return type === "array" || length === 0 || typeof length === "number" && length > 0 && (length - 1) in obj;
};