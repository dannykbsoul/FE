//闭包
var Example = (function () {
  var _private = '';
  class Example {
    constructor() {
      _private = 'private';
    }
    getName() {
      return _private;
    }
  }
  return Example;
})();

//Symbol
var Example = (function () {
  var _private = Symbol('private');
  class Example {
    constructor() {
      this[_private] = 'private';
    }
    getName() {
      return this[_private];
    }
  }
  return Example;
})();

//WeakMap
var Example = (function () {
  var _private = new WeakMap();
  class Example {
    constructor() {
      _private.set(this, 'private');
    }
    getName() {
      return _private.get(this);
    }
  }
  return Example;
})();