function singleton() {};
let Single = function () {
  let instance = null;
  return function () {
    if (!instance) {
      instance = new singleton();
    }
    return instance;
  }
}()

class Singleton {
  static getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}
let obj1 = Singleton.getInstance();
let obj2 = Singleton.getInstance();
console.log(obj1 === obj2);