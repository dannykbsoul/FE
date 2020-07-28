//发布订阅模式
//用于储存订阅者并发布消息
class Dep {
  constructor() {
    this.subs = []; //存放所有的watcher
  }
  //订阅
  addSub(watcher) { //添加watcher
    this.subs.push(watcher);
  }
  //发布
  notify() {
    this.subs.forEach(watcher => watcher.update());
  }
}

class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm;
    this.expr = expr;
    this.cb = cb;
    //默认先存放一个老值
    this.oldValue = this.get();
  }
  get() { //vm.$data.school vm.$data.school.name
    Dep.target = this; //先把自己放到this上
    //取值，此时去this.vm上取值，会被observer上的get劫持
    let value = CompileUtil.getVal(this.vm, this.expr);
    Dep.target = null;
    return value;
  }
  update() { //更新操作 数据变化后，会调用观察者的update方法
    let newVal = CompileUtil.getVal(this.vm, this.expr);
    if (newVal !== this.oldValue) {
      this.cb(newVal);
    }
  }
}

class Observer { //实现数据劫持
  constructor(data) {
    this.observer(data);
  }

  observer(data) {
    if (data && typeof data === 'object') {
      for (let key in data) {
        this.defineReactive(data, key, data[key]);
      }
    }
  }
  defineReactive(obj, key, value) {
    //如果值还是对象，那么需要递归添加set和get
    this.observer(value);
    let dep = new Dep(); //给每一个属性，都加上一个具有发布订阅的功能
    Object.defineProperty(obj, key, {
      get: () => {
        //如果Dep类存在target属性，将其添加到dep实例的subs数组中
        //target指向一个Watcher实例，每个Watcher都是一个订阅者
        //Watcher实例在实例化过程中，会读取data中的某个属性，从而触发当前get方法
        //创建watcher时，会取到对应的内容，并且把watcher放到全局上
        Dep.target && dep.addSub(Dep.target);
        return value;
      },
      set: (newVal) => {
        if (newVal !== value) {
          value = newVal;
          //如果说赋值的对象，那么也需要将赋值的对象深度劫持
          //这里需要用箭头函数，不然this指向的是obj
          //对新值进行监听
          this.observer(newVal);
          //通知所有订阅者，数值被改变了
          dep.notify();
        }
      }
    })
  }
}

class Compiler {
  constructor(el, vm) {
    //判断el属性，是不是一个元素 因为传入的el有可能只是字符串，需要我们手动查找
    //或者说是一个dom元素，拿到可以直接用
    this.el = this.isElementNode(el) ? el : document.querySelector(el);
    this.vm = vm;
    //此时得到了模版，我们需要将模版中需要替换的数据替换掉
    //但是如果我们每次找到需要替换的就立即替换的话，会造成页面频繁的回流重绘
    //所以最好的做法就是将当前节点的元素全部放到内存中，在内存中替换，全部替换好以后再放回页面
    let fragment = this.node2fragment(this.el);
    //将节点中的内容进行替换

    //编译模版，用数据编译
    this.compile(fragment);

    //替换完成后，将节点内容重新塞回页面中
    this.el.appendChild(fragment);
  }
  isDirective(attrName) {
    return attrName.startsWith('v-');
  }
  //编译元素
  compileElement(node) {
    let attributes = node.attributes;
    [...attributes].forEach(attr => {
      //type="text"  v-model="school.name"
      let {
        name,
        value: expr
      } = attr;
      //判断是不是指令 即以'v-'开头的
      if (this.isDirective(name)) { //v-model v-html v-bind
        let [, directive] = name.split('-');
        let [directiveName, eventName] = directive.split(':'); // v-on:click
        //需要调用不同的指令来处理
        //此时有了this.vm拿到数据，去替换expr中的值，最后放到node中
        CompileUtil[directiveName](node, expr, this.vm, eventName);
      }
    })
  }
  //编译文本
  compileText(node) { //判断当前文本节点中内容是否包含{{}}
    let content = node.textContent;
    if (/\{\{(.+?)\}\}/.test(content)) {
      CompileUtil['text'](node, content, this.vm);
    }
  }
  compile(node) { //用来编译内存中的dom节点
    let childNodes = node.childNodes; //类数组
    [...childNodes].forEach(child => {
      //对于元素看里面有没有v-model
      //对于文本看里面有没有{{}}
      if (this.isElementNode(child)) {
        this.compileElement(child);
        //如果是元素的话，还需要再去遍历子节点
        this.compile(child);
      } else {
        this.compileText(child);
      }
    });
  }
  //把节点移动到内存中
  node2fragment(node) {
    //创建文档碎片
    let fragment = document.createDocumentFragment();
    let firstChild;
    while (firstChild = node.firstChild) {
      //appendChild具有移动性，每放到内存中一个节点，页面中就少一个节点，此时node
      //拿到的firstChild自然又移到了下一个
      fragment.appendChild(firstChild);
    }
    return fragment;
  }
  isElementNode(node) { //是不是元素节点
    return node.nodeType === 1;
  }
}

//由于需要处理多个指令，每个指令的处理方式也不同，所以单独写个工具函数
CompileUtil = {
  //根据表达式取到对应的数据
  getVal(vm, expr) { //vm.$data下的school.name
    return expr.split('.').reduce((pre, cur) => {
      return pre[cur];
    }, vm.$data)
  },
  setVal(vm, expr, value) {
    expr.split('.').reduce((pre, cur, index, arr) => {
      if (index === arr.length - 1) {
        //当当前的值是最后一项的时候，说明取到了需要赋值的对象，直接赋值，完成视图改变数据
        return pre[cur] = value;
      }
      return pre[cur];
    }, vm.$data)
  },
  model(node, expr, vm) { //node是节点 expr是表达式 vm是当前实例
    //v-model="school.name"  去vm.$data中去找school.name
    let fn = this.updater['modelUpdater'];
    //给输入框加一个观察者，稍后数据更新了会触发此方法，会拿新值给输入框赋新值
    new Watcher(vm, expr, (newVal) => {
      fn(node, newVal)
    });
    //此时完成了数据驱动视图，还需要完成视图驱动数据 即绑定事件
    node.addEventListener('input', (e) => {
      let value = e.target.value; //获取用户输入的内容
      this.setVal(vm, expr, value);
    })
    let value = this.getVal(vm, expr);
    fn(node, value);
  },
  html(node, expr, vm) {
    let fn = this.updater['htmlUpdater']; //xss攻击
    new Watcher(vm, expr, (newVal) => {
      fn(node, newVal);
    })
    let value = this.getVal(vm, expr);
    fn(node, value);
  },
  on(node, expr, vm, eventName) {
    //给元素绑定事件，回调函数就是methods上绑定的方法
    node.addEventListener(eventName, (e) => {
      vm[expr].call(vm, e); //this需要指向vm
    })
  },
  getContentValue(vm, expr) {
    //遍历表达式 将内容 重新替换成一个完整的内容返回去
    return expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
      return this.getVal(vm, args[1]);
    })
  },
  text(node, expr, vm) { //expr => {{a}} {{b}} {{c}}
    let content = expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
      //args第一个参数是匹配到的字符串，第二个参数是匹配到的分组，然后是匹配到的字符串的位置，最后是被匹配的字符串。
      //我们观察的是a、b、c，所以是args[1]
      new Watcher(vm, args[1], () => {
        //给表达式每个{{}}都加上观察者
        fn(node, this.getContentValue(vm, expr)); //返回一个全的字符串
        //比如说你{{a}} {{b}} {{c}}中，只有a变化了，那么我们要将a变化，然后返回整个字符串回来
        //而不是只返回a对应的字符串
      })
      return this.getVal(vm, args[1]);
    })
    let fn = this.updater['textUpdater'];
    fn(node, content);
  },
  updater: {
    //把数据插入到节点中
    modelUpdater(node, value) {
      node.value = value;
    },
    htmlUpdater(node, value) {
      node.innerHTML = value;
    },
    textUpdater(node, value) {
      node.textContent = value;
    }
  }
}

class Vue {
  constructor(options) {
    //this.$el $data $options
    this.$el = options.el;
    this.$data = options.data;
    let computed = options.computed;
    let methods = options.methods;
    //这个根元素存在，编译模版
    if (this.$el) {
      //把数据全部劫持
      new Observer(this.$data);
      //computed
      for (let key in computed) { //有依赖关系
        Object.defineProperty(this.$data, key, {
          get: () => {
            return computed[key].call(this);
          }
        })
      }
      //methods
      for (let key in methods) {
        Object.defineProperty(this, key, {
          get() {
            return methods[key];
          }
        })
      }

      //把获取数据操作 vm上的取值操作 都代理到vm.$data上 proxy
      this.proxyVm(this.$data);

      //传入需要编译的元素，以及实例this
      new Compiler(this.$el, this);
    }
  }
  proxyVm(data) {
    for (let key in data) {
      Object.defineProperty(this, key, {
        get() {
          return data[key];
        },
        set(newVal) {
          data[key] = newVal;
        }
      })
    }
  }
}