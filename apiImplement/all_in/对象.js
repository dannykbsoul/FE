Function.prototype.MyCall = function (context, ...args) {
    if (typeof this !== 'function') {
        throw new TypeError('Error');
    }
    context = context || window;
    let fn = Symbol();
    context[fn] = this;
    let res = context[fn](...args);
    Reflect.deleteProperty(context, fn);
    return res;
}

Function.prototype.MyApply = function (context, args) {
    if (typeof this !== 'function') {
        throw new TypeError('error');
    }
    context = context || window;
    let fn = Symbol();
    context[fn] = this;
    let res = context[fn](...args);
    Reflect.deleteProperty(context, fn);
    return res;
}

Function.prototype.MyBind = function (context, ...args) {
    if (typeof this !== 'function') {
        throw new TypeError('error');
    }
    context = context || window;
    let self = this;
    let fBound = function () {
        return self.apply(this instanceof fBound ? this : context, args.concat(...arguments));
    }
    // fBound.prototype = Object.create(this.prototype);
    let fNOP = function () {};
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
}

function create(proto) {
    function F() {};
    F.prototype = proto;
    F.prototype.constructor = F;
    return new F();
}

function myNew(constructor, ...args) {
    if (typeof constructor !== 'function') {
        throw 'newOperator function the first param must be a function';
    }
    let instance = Object.create(constructor.prototype);
    let result = constructor.apply(instance, args);
    return (typeof result === 'object' && result !== 'null') || typeof result === 'function' ? result : instance;
}

function instance_of(L, R) {
    let O = R.prototype;
    // L = Object.getPrototypeOf(L);
    L = L.__proto__;
    while (true) {
        if (L === null) return false;
        if (L === O) return true;
        L = L.__proto__;
    }
}

// Symbol.hasInstance可以自定义instanceof的行为，所以说也不是很可靠
class PrimitiveString {
    static[Symbol.hasInstance](x) {
        return typeof x === 'string'
    }
}
console.log('hello world'
    instanceof PrimitiveString) // true

// Object.is()
function is(x, y) {
    if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
    } else return x !== x && y !== y;
}

//1.原型链继承：将子类构造函数的prototype指向父类的实例对象
Child.prototype = new Parent();
//2.借用构造函数
function Child() {
    Father.call(this);
}
//3.组合继承
function Child() {
    Parent.call(this);
}
Child.prototype = new Parent();
//4.原型式继承
function object(o) {
    function F() {}
    F.prototype = o;
    return new F();
}
//5.寄生式继承
function createObj(o) {
    var clone = Object.create(o);
    clone.sayName = function () {
        console.log('hi');
    }
    return clone;
}
//6.寄生组合继承
function Parent() {
    this.name = 'parent';
    this.play = [1, 2, 3];
}

function Child() {
    Parent.call(this);
    this.type = 'child';
}
//1. 这一步不用Child.prototype =Parent.prototype的原因是怕共享内存，修改父类原型对象就会影响子类
//2. 不用Child.prototype = new Parent()的原因是会调用2次父类的构造方法（另一次是call），会存在一份多余的父类实例属性
//3. Object.create是创建了父类原型的副本，与父类原型完全隔离
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

//7.class继承
class A {
    constructor() {
        this.x = 100;
    }
    getX() {
        console.log(this.x);
    }
}

class B extends A {
    constructor() {
        super();
        this.y = 200;
    }
    getY() {
        console.log(this.y);
    }
}

let b = new B();
console.log(b);

// 数组的高阶函数实现
Array.prototype.myMap = function(callbackFn, thisArg) {
    // 处理数组类型异常
    if(this == null ) {
      throw new TypeError("Cannot read property 'map' of null or undefined");
    }
    // 处理回调函数类型异常
    if(Object.prototype.toString.call(callbackFn) != "[object Function]") {
      throw new TypeError(callbackfn + ' is not a function')
    }
    let O = Object(this);
    let T = thisArg;
    
    let len = O.length >>> 0;
    let A = new Array(len);
    for(let k = 0;k < len;k++) {
      if(k in O) {
        let kValue = O[k];
        let mappedValue = callbackFn.call(T, kValue, k, O);
        A[k] = mappedValue;
      }
    }
    return A;
  }
  
  Array.prototype.myReduce = function(callbackFn, initialValue) {
    // 异常处理，和 map 一样
    // 处理数组类型异常
    if (this === null || this === undefined) {
      throw new TypeError("Cannot read property 'reduce' of null or undefined");
    }
    // 处理回调类型异常
    if (Object.prototype.toString.call(callbackFn) != "[object Function]") {
      throw new TypeError(callbackfn + ' is not a function')
    }
    let O = Object(this);
    let len = O.length >>> 0;
    let k = 0;
    let accumulator = initialValue;
    if(accumulator === undefined) {
      for(;k < len;k++) {
        if(k in O) {
          accumulator = O[k];
          k++;
          break;
        }
      }
    }
    if(k === len && accumulator === undefined) {
      throw new Error('Each element of the array is empty');
    }
    for(;k < len;k++) {
      if(k in O) {
        accumulator = callbackFn.call(undefined,accumulator,O[k],k,O);
      }
    }
    return accumulator;
  }
  
  Array.prototype.myPush = function(...items) {
    let O = Object(this);
    let len = this.length >>> 0;
    let argCount = items.length >>> 0;
    // 2 ** 53 - 1 为JS能表示的最大正整数
    if (len + argCount > 2 ** 53 - 1) {
      throw new TypeError("The number of array is over the max value restricted!")
    }
    for(let i = 0; i < argCount; i++) {
      O[len + i] = items[i];
    }
    let newLength = len + argCount;
    O.length = newLength;
    return newLength;
  }
  
  Array.prototype.myPop = function() {
    let O = Object(this);
    let len = this.length >>> 0;
    if(len === 0) {
      O.length = 0;
      return undefined;
    }
    len--;
    let value = O[len];
    delete O[len];
    O.length = len;
    return value;
  }
  
  Array.prototype.myFilter = function(callbackfn, thisArg) {
    // 处理数组类型异常
    if (this === null || this === undefined) {
      throw new TypeError("Cannot read property 'filter' of null or undefined");
    }
    // 处理回调类型异常
    if (Object.prototype.toString.call(callbackfn) != "[object Function]") {
      throw new TypeError(callbackfn + ' is not a function')
    }
    let O = Object(this);
    let len = O.length >>> 0;
    let resLen = 0;
    let res = [];
    for(let i = 0;i < len;i++) {
      if(i in O) {
        let element = O[i];
        if(callbackfn.call(thisArg, element, i, O)) {
          res[resLen++] = element;
        }
      }
    }
    return res;
  }
  
  Array.prototype.mySplice = function(startIndex, deleteCount, ...addElements) {
    let argumentsLen = arguments.length;
    let array = Object(this);
    let len = array.length;
    let deleteArr = new Array(deleteCount);
    // 下面参数的清洗工作
    startIndex = computeStartIndex(startIndex, len);
    deleteCount = computeDeleteCount(startIndex, len, deleteCount, argumentsLen);
  
    // 判断 sealed 对象和 frozen 对象, 即 密封对象 和 冻结对象
    if (Object.isSealed(array) && deleteCount !== addElements.length) {
      throw new TypeError('the object is a sealed object!')
    } else if(Object.isFrozen(array) && (deleteCount > 0 || addElements.length > 0)) {
      throw new TypeError('the object is a frozen object!')
    }
  
    // 拷贝删除的元素
    sliceDeleteElements(array, startIndex, deleteCount, deleteArr);
    // 移动删除元素后面的元素
    movePostElements(array, startIndex, len, deleteCount, addElements);
    // 插入新元素
    for (let i = 0; i < addElements.length; i++) {
      array[startIndex + i] = addElements[i];
    }
    array.length = len - deleteCount + addElements.length;
    return deleteArr;
  }
  
  const computeStartIndex = (startIndex, len) => {
    // 处理索引负数的情况
    if (startIndex < 0) {
      return startIndex + len > 0 ? startIndex + len: 0;
    } 
    return startIndex >= len ? len: startIndex;
  }
  
  const computeDeleteCount = (startIndex, len, deleteCount, argumentsLen) => {
    // 删除数目没有传，默认删除startIndex及后面所有的
    if (argumentsLen === 1) 
      return len - startIndex;
    // 删除数目过小
    if (deleteCount < 0) 
      return 0;
    // 删除数目过大
    if (deleteCount > len - startIndex) 
      return len - startIndex;
    return deleteCount;
  }
  
  const sliceDeleteElements = (array, startIndex, deleteCount, deleteArr) => {
    for (let i = 0; i < deleteCount; i++) {
      let index = startIndex + i;
      if (index in array) {
        let current = array[index];
        deleteArr[i] = current;
      }
    }
  };
  
  const movePostElements = (array, startIndex, len, deleteCount, addElements) => {
    //...
    if (deleteCount === addElements.length) return;
    // 如果添加的元素和删除的元素个数不相等，则移动后面的元素
    if(deleteCount > addElements.length) {
      // 删除的元素比新增的元素多，那么后面的元素整体向前挪动
      // 一共需要挪动 len - startIndex - deleteCount 个元素
      for (let i = startIndex + deleteCount; i < len; i++) {
        let fromIndex = i;
        // 将要挪动到的目标位置
        let toIndex = i - (deleteCount - addElements.length);
        if (fromIndex in array) {
          array[toIndex] = array[fromIndex];
        } else {
          delete array[toIndex];
        }
      }
      // 注意注意！这里我们把后面的元素向前挪，相当于数组长度减小了，需要删除冗余元素
      // 目前长度为 len + addElements - deleteCount
      for (let i = len - 1; i >= len + addElements.length - deleteCount; i --) {
        delete array[i];
      }
    } 
    if(deleteCount < addElements.length) {
      // 删除的元素比新增的元素少，那么后面的元素整体向后挪动
      // 思考一下: 这里为什么要从后往前遍历？从前往后会产生什么问题？
      for (let i = len - 1; i >= startIndex + deleteCount; i--) {
        let fromIndex = i;
        // 将要挪动到的目标位置
        let toIndex = i + (addElements.length - deleteCount);
        if (fromIndex in array) {
          array[toIndex] = array[fromIndex];
        } else {
          delete array[toIndex];
        }
      }
    }
  };
  
  const insertSort = (arr, start=0,end) => {
    end = end||arr.length;
    for(let i=start;i<end;i++) {
      let e=arr[i];
      let j;
      for(j=i;j > start&&arr[j-1]>e;j--) {
        arr[j]=arr[j-1];
      } 
      arr[j]=e;
    }
    return;
  }