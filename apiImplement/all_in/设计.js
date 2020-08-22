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

class EventEmitter {
    constructor() {
        //用于存储事件与回调之间的对应关系
        this.eventPool = {};
    }
    // on方法用于安装事件监听器，它接受目标事件名和回调函数作为参数 订阅事件，并且有回调函数
    on(eventName, cb) {
        this.eventPool[eventName] ? this.eventPool[eventName].push(cb) : this.eventPool[eventName] = [cb];
    }
    // emit方法用于触发目标事件，它接受事件名和监听函数入参作为参数
    emit(eventName, ...args) {
        this.eventPool[eventName] && this.eventPool[eventName].forEach(cb => cb(...args));
    }
    // 移除某个事件回调队列里的指定回调函数
    off(eventName, cb) {
        if (this.eventPool[eventName]) {
            let index = this.eventPool[eventName].indexOf(cb);
            this.eventPool[eventName].splice(index, 1);
            if (this.eventPool[eventName].length === 0) delete this.eventPool[eventName];
        }
    }
    // 为事件注册单次监听器
    // 将订阅的方法再包裹一层函数，在执行后将此函数移除即可。
    once(eventName, cb) {
        let self = this;
        this.on(eventName, function _cb(...args) {
            cb(...args);
            self.off(eventName, _cb);
        })
    }
}