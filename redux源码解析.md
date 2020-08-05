# 前言

虽然学习了react有一段时间了，也知道redux的流程，会用的程度吧。但是背后的原理诸如createStore、applyMiddleware等API背后到底发生了什么事情，我其实还是不怎么了解的，因此最近花了几天时间阅读了Redux的源码，写下文章纪录一下自己在看源码的一些理解。



# 1.index.ts

~~~TS
import createStore from './createStore'
import combineReducers from './combineReducers'
import bindActionCreators from './bindActionCreators'
import applyMiddleware from './applyMiddleware'
import compose from './compose'

......

export { createStore, combineReducers, bindActionCreators, applyMiddleware, compose }
~~~

最关注的是createStore，毕竟我们的store是由createStore创建的，所有的一切都是围绕这个展开的

# 2.createStore.ts

> 首先引入的是TS的类型，统一放在types文件下

~~~TS
import $$observable from './utils/symbol-observable'

import {
  Store,
  PreloadedState,
  StoreEnhancer,
  Dispatch,
  Observer,
  ExtendState
} from './types/store'
import { Action } from './types/actions'
import { Reducer } from './types/reducers'
~~~

> 接着引入一些判断工具，utils工具包

~~~TS
import ActionTypes from './utils/actionTypes'
import isPlainObject from './utils/isPlainObject'
~~~



> 1. 创建一个包含状态树的store，只能通过dispatch的方式改变store中的data
> 2. 一个app中有且只有一个store
> 3. 根据不同的action拆分成不同reducer，最终需要通过`combineReducers`来合并成一个reducer
>
> 参数：
>
> 1. reducer：纯函数，接收一个state和action，返回一个全新的state
> 2. preloadedState：初始状态
> 3. enhancer：你可以选择指定它来增强store的第三方功能，Redux附带的唯一store增强器是`applyMiddleware()`
>
> 返回：
>
> 一个对象，也就是通常我们所说的store，它可以getState()、dispatch()、subscribe()

~~~
/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param preloadedState The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param enhancer The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */
~~~

> 为了代码看的更加清晰，将一些无关紧要的代码去除了
>
> 可以看出这设计的太🐂🍺了，***首先通过闭包将内部变量私有化，外部是无法访问闭包内的变量的，然后通过对外暴露接口的方式，以达到外部对内部属性的访问***

~~~TS
export default function createStore(reducer, preloadedState, enhancer) {
	
  //前面这一系列判断是对用户的传参进行兼容处理
  //如果此时传入的参数除了redecer有超过1个函数，那么说明此时传入的中间件没有合并处理
  if (
    (typeof preloadedState === 'function' && typeof enhancer === 'function') ||
    (typeof enhancer === 'function' && typeof arguments[3] === 'function')
  ) {
    throw new Error(
      'It looks like you are passing several store enhancers to ' +
        'createStore(). This is not supported. Instead, compose them ' +
        'together to a single function.'
    )
  }
  
  //合并到下一个判断处理
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState
    preloadedState = undefined
  }

  //如果此时enhancer是函数，说明是中间件，那么此时需要提前对dispatch加强处理，传入createStore
  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.')
    }

    return enhancer(createStore)(
      reducer,
      preloadedState
    ) 
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.')
  }
  
  let currentReducer = reducer
  let currentState = preloadedState as S
  let currentListeners: (() => void)[] | null = []
  let nextListeners = currentListeners
  //是否正在dispatch
  let isDispatching = false

  function getState(): S {
    ...
    return currentState as S
  }

  function subscribe(listener: () => void) {
    ...
  }

  function dispatch(action: A) {
    ...
    return action
  }

  function replaceReducer<NewState, NewActions extends A>(
    nextReducer: Reducer<NewState, NewActions>
  ): Store<ExtendState<NewState, StateExt>, NewActions, StateExt, Ext> & Ext {
      ...
  }

  function observable() {
    ...
  }

  dispatch({ type: ActionTypes.INIT } as A)

  const store = ({
    dispatch: dispatch as Dispatch<A>,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: observable
  } as unknown) as Store<ExtendState<S, StateExt>, A, StateExt, Ext> & Ext
  return store
}

~~~



## 2.1 subscribe

> 注册listener，同时返回一个取消listener的方法
>
> 需要注意的是：当reducer在执行的时候，是不能subscribe或者unsubscribe listener的

~~~TS
function ensureCanMutateNextListeners() {
  if (nextListeners === currentListeners) {
    nextListeners = currentListeners.slice()
  }
}

function subscribe(listener: () => void) {
  if (typeof listener !== "function") {
    throw new Error("Expected the listener to be a function.");
  }

  if (isDispatching) {
    throw new Error(
      "You may not call store.subscribe() while the reducer is executing. " +
        "If you would like to be notified after the store has been updated, subscribe from a " +
        "component and invoke store.getState() in the callback to access the latest state. " +
        "See https://redux.js.org/api/store#subscribelistener for more details."
    );
  }

  let isSubscribed = true;

  ensureCanMutateNextListeners();
  nextListeners.push(listener);

  return function unsubscribe() {
    if (!isSubscribed) {
      return;
    }

    if (isDispatching) {
      throw new Error(
        "You may not unsubscribe from a store listener while the reducer is executing. " +
          "See https://redux.js.org/api/store#subscribelistener for more details."
      );
    }

    isSubscribed = false;

    ensureCanMutateNextListeners();
    const index = nextListeners.indexOf(listener);
    nextListeners.splice(index, 1);
    currentListeners = null;
  };
}
~~~





## 2.2 dispatch

> 1. 首先action必须要是plainObject并且有type属性
>
>    ~~~ts
>    export default function isPlainObject(obj: any): boolean {
>      if (typeof obj !== 'object' || obj === null) return false
>    
>      let proto = obj
>      while (Object.getPrototypeOf(proto) !== null) {
>        proto = Object.getPrototypeOf(proto)
>      }
>    
>      return Object.getPrototypeOf(obj) === proto
>    }
>    ~~~
>
> 2. dispatch是唯一可以修改state的地方，并且使用try...finally的语句来保证在修改state的过程中isDispatching为false，只有等修改完了才重新置为true
>
> 3. 最后再执行所有subscribe的回调函数，并且一般都是要在回调函数里面store.getState()去拿最新的数据

~~~TS
function dispatch(action: A) {
  if (!isPlainObject(action)) {
    throw new Error(
      "Actions must be plain objects. " +
        "Use custom middleware for async actions."
    );
  }

  if (typeof action.type === "undefined") {
    throw new Error(
      'Actions may not have an undefined "type" property. ' +
        "Have you misspelled a constant?"
    );
  }

  if (isDispatching) {
    throw new Error("Reducers may not dispatch actions.");
  }

  try {
    isDispatching = true;
    currentState = currentReducer(currentState, action);
  } finally {
    isDispatching = false;
  }

  const listeners = (currentListeners = nextListeners);
  for (let i = 0; i < listeners.length; i++) {
    const listener = listeners[i];
    listener();
  }

  return action;
}
~~~





# 3.bindActionCreators.ts

`bindActionCreator`将会返回一个函数，这个函数会用自身所接收的参数来调用`actionCreator`并生成对应动作，并且这个生成的动作将会作为`dispatch`函数的参数。也就是说我们将生成动作和调度动作封装在了一起。

~~~TSX
function bindActionCreator<A extends AnyAction = AnyAction>(
  actionCreator: ActionCreator<A>,
  dispatch: Dispatch
) {
  return function (this: any, ...args: any[]) {
    return dispatch(actionCreator.apply(this, args))
  }
}
~~~

两种情况：

1. 如果传入的actionCreators是一个函数的时候，说明是单一的action，直接调用上述的`bindActionCreator`
2. 如果传入的actionCreators是一个对象的时候，我们会以键值对的形式存储到`boundActionCreators`上

~~~TSX
export default function bindActionCreators(
  actionCreators: ActionCreator<any> | ActionCreatorsMapObject,
  dispatch: Dispatch
) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch)
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error(
      `bindActionCreators expected an object or a function, instead received ${
        actionCreators === null ? 'null' : typeof actionCreators
      }. ` +
        `Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`
    )
  }

  const boundActionCreators: ActionCreatorsMapObject = {}
  for (const key in actionCreators) {
    const actionCreator = actionCreators[key]
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
    }
  }
  return boundActionCreators
}
~~~

举个🌰

~~~JS
const MyActionCreators = {
  increment: function(step) {
    return {
      type: 'INCREMENT',
      step: step || 1
    }
  },

  decrement: function(step) {
    return {
      type: 'DECREMENT',
      step: - (step || 1)
    }
  }
}

const dispatch = function(action) {
  console.log(action)
}

const boundActionCreators = bindActionCreators(MyActionCreators, dispatch)
~~~

previous：

~~~JSX
dispatch(MyActionCreators.increment()) // { type: 'INCREMENT', step: 1 }
dispatch(MyActionCreators.increment(2)) // { type: 'INCREMENT', step: 2 }
dispatch(MyActionCreators.decrement()) // { type: 'DECREMENT', step: -1 }
dispatch(MyActionCreators.decrement(2)) // { type: 'DECREMENT', step: -2 }
~~~

now：

~~~JSX
boundActionCreators.increment() // { type: 'INCREMENT', step: 1 }
boundActionCreators.increment(2) // { type: 'INCREMENT', step: 2 }
boundActionCreators.decrement() // { type: 'DECREMENT', step: -1 }
boundActionCreators.decrement(2) // { type: 'DECREMENT', step: -2 }
~~~

⚠️

**Action的取名尽量不要重复**

因为如果重复的话，当我们进行如下操作的时候，我们会发现同名key的action会覆盖

~~~JS
const aActions = {
  fetchID: action,
}

const bActions = {
  fetchID: action,
}

const mapDispatchToProps => dispatch => {
  return {
    ...bindActionCreators(aActions, dispatch); //fetchID
    ...bindActionCreators(bActions, dispatch); //fetchID
  }
}
~~~

# 4.combineReducers.ts

> 对于真实项目中，一开始项目比较小，所以可能会放在一个reducer中，但是随着项目的不断的扩大，会分成很多个reducer，但是redux中最终只能有一个reduer，所以我们需要考虑如何将reducer合并

用法：

~~~jsx
// 两个reducer
const aReducer = (state = initaState, action) => {}
const bReducer = (state = initbState, action) => {}

const Reducer = combineReducers({
  aReducer,
  bReducer,
})
~~~



~~~TS
function assertReducerShape(reducers: ReducersMapObject) {
  Object.keys(reducers).forEach(key => {
    const reducer = reducers[key]
    const initialState = reducer(undefined, { type: ActionTypes.INIT })

    if (typeof initialState === 'undefined') {
      throw new Error(
        `Reducer "${key}" returned undefined during initialization. ` +
          `If the state passed to the reducer is undefined, you must ` +
          `explicitly return the initial state. The initial state may ` +
          `not be undefined. If you don't want to set a value for this reducer, ` +
          `you can use null instead of undefined.`
      )
    }

    if (
      typeof reducer(undefined, {
        type: ActionTypes.PROBE_UNKNOWN_ACTION()
      }) === 'undefined'
    ) {
      throw new Error(
        `Reducer "${key}" returned undefined when probed with a random type. ` +
          `Don't try to handle ${ActionTypes.INIT} or other actions in "redux/*" ` +
          `namespace. They are considered private. Instead, you must return the ` +
          `current state for any unknown actions, unless it is undefined, ` +
          `in which case you must return the initial state, regardless of the ` +
          `action type. The initial state may not be undefined, but can be null.`
      )
    }
  })
}
~~~



~~~TS
export default function combineReducers(reducers: ReducersMapObject) {
  
  //得到所有的reducer键名的集合
  const reducerKeys = Object.keys(reducers)
  
  //将键值是函数的合并到一起
  const finalReducers: ReducersMapObject = {}
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i]

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  }
  const finalReducerKeys = Object.keys(finalReducers)
  
	//再一次过滤，判断reducer中传入的值是否合法
  let shapeAssertionError: Error
  try {
    //assertReducerShape 函数用于遍历finalReducers中的reducer，检查传入reducer的state是否合法
    assertReducerShape(finalReducers)
  } catch (e) {
    shapeAssertionError = e
  }

  return function combination(
    state: StateFromReducersMapObject<typeof reducers> = {},
    action: AnyAction
  ) {
    let hasChanged = false
    const nextState: StateFromReducersMapObject<typeof reducers> = {}
                                                
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i]
      
      //这也就是为什么说combineReducers黑魔法--要求传入的Object参数中，reducer function的名称和要和state同名的原因
      const reducer = finalReducers[key]
      const previousStateForKey = state[key]
      
      //将reducer返回的值，存入nextState
      const nextStateForKey = reducer(previousStateForKey, action)
      nextState[key] = nextStateForKey
      
      //如果任一state有更新则hasChanged为true
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }
    hasChanged =
      hasChanged || finalReducerKeys.length !== Object.keys(state).length
    return hasChanged ? nextState : state
  }
}
~~~



> 为什么redux必须返回一个新的state？
>
> ~~~ts
>  hasChanged = hasChanged || nextStateForKey !== previousStateForKey
> ~~~
>
> 可以看出state前后对比采用的是===，所以如果只是在原state上更新的话，由于地址不会变，那么其实hasChanged永远都是false，当我们 reducer 直接返回旧的 state 对象时，Redux 认为没有任何改变，从而导致页面没有更新。除非是深比较，那么其实开销是非常大的，所以一般都是



# 5.applyMiddleware.ts

增强dispatch action到reducer中间的功能，去完成一些事情

> redux-thunk中间件的实现

~~~JSX
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => (next) => (action) => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
~~~

> `const store = createStore(reducers, applyMiddleware());`
>
> `return enhancer(createStore)(reducer,preloadedState) `
>
> 其中enhancer是applyMiddleware()返回的结果

~~~TS
import compose from './compose'

export default function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, ...args) => {
    
    //利用传入的createStore和reducer创建一个store
    const store = createStore(reducer, ...args)
    let dispatch = () => {
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. ' +
          'Other middleware would not be applied to this dispatch.'
      )
    }

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action, ...args) => dispatch(action, ...args),
    }
    //让每个middleware带着middlewareAPI这个参数执行一遍
    const chain = middlewares.map((middleware) => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch,
    }
  }
}

~~~

> 可以看出applyMiddleware是个三级柯里化的函数，它将陆续地获得三个参数：
>
> + middleware数组
> + redux原生的createStore
> + reducer和preloadedState
>
> 接着applyMiddleware 利用 createStore 和 reducer 创建了一个 store，然后 store 的 getState 方法和 dispatch 方法又分别被直接和间接地赋值给 middlewareAPI 变量。
>
> 函数式编程：
>
> 1. 函数是一等公民：在 JS 中，函数可以当作是变量传入，也可以赋值给一个变量，甚至于，函数执行的返回结果也可以是函数。
> 2. 数据是不可变的(Immutable)：在函数式编程语言中，数据是不可变的，所有的数据一旦产生，就不能改变其中的值，如果要改变，那就只能生成一个新的数据。
> 3. 函数只接受一个参数：`const middleware = (store) => (next) => (action) => {}`

~~~JSX
const chain = middlewares.map((middleware) => middleware(middlewareAPI))
~~~

这句话会得到一个函数数组

~~~JSX
chain = [
  function a(next) {
    return function aa(action) {
      console.log("a进入");
      const start = Date.now();
      next(action);
      const ms = Date.now() - start;
      console.log(`dispatch: ${action.type} - ${ms}ms`);
      console.log("a离开");
    };
  },
  function b(next) {
    return function bb(action) {
      console.log("b进入");
      next(action);
      console.log(store.getState());
      console.log("b离开");
    };
  },
  function c(next) {
    return function cc(action) {
      console.log("c进入");
      next(action);
      console.log("c离开");
    };
  },
];
~~~

接着执行

~~~JSX
dispatch = compose(...chain)(store.dispatch)
~~~

相当于

~~~JSX
a(b(c(store.dispatch)))
~~~

接着我们来看看这个表达式是什么？

~~~JSX
c(store.dispatch) = function cc(action) {
  console.log("c进入");
  store.dispatch(action);
  console.log("c离开");
};
~~~

~~~JSX
b(c(store.dispatch)) = function bb(action) {
  // next(action) 此时next 为 c(store.dispatch)
  console.log("b进入");
  (function cc(action) {
    console.log("c进入");
    store.dispatch(action);
    console.log("c离开");
  })(action);
  console.log(store.getState());
  console.log("b离开");
};
~~~

~~~JSX
a(b(c(store.dispatch))) = function aa(action) {
  console.log("a进入");
  const start = Date.now();
  (function bb(action) {
    console.log("b进入");
    (function cc(action) {
      console.log("c进入");
      store.dispatch(action);
      console.log("c离开");
    })(action);
    console.log(store.getState());
    console.log("b离开");
  })(action);
  const ms = Date.now() - start;
  console.log(`dispatch: ${action.type} - ${ms}ms`);
  console.log("a离开");
};
~~~

这时候我们得到了最终的dispatch，a中的next参数就是函数b执行完之后返回的函数，b中的next参数就是函数c执行完之后返回的函数，c中的next参数才是原来的dispatch，这样就实现了对dispatch的增强

chain 其实是一个 `(next) => (action) => { ... }` 函数的数组。之后我们以 `store.dispatch` 作为参数进行注入，通过 `compose` 对中间件数组内剥出来的高阶函数进行组合形成一个调用链。调用一次，中间件内的所有函数都将被执行。

## 5.1洋葱模型

1. 洋葱的上下文

   getState：这样每一层都能获取到当前的状态

   dispatch：可以将操作往下传递

2. 洋葱层之间的顺序关系

   从外向内逐层调用，某些情况下我们要从从第一层从新调用。比如：当你在这层action改变了状态，或者，进行了某种校验，发现不符合业务逻辑需要跳转。最常见的就是异步请求，当你的action是一个异步请求的时候，这时，当结果回来的时候从逻辑的完整性来说，是需要从第一层触发action的。因为，此时回来的数据对所有的middware来说，都是需要处理的消息。所以我们的dispatch需要两个，用于从头开始的dispatch，也就是最终的dispatch，用于跳到下一层洋葱皮的dispatch。一般将跳到下一层的称为next。

我们知道可以通过compose得到最终的dispatch，当然compose的前提是一系列相同声明的函数，相同声明指的是入参&返回值一致。

~~~js
midware1 = (dipatch, getState) => next => action => {};
midware2 = (dipatch, getState) => next => action => {};
midware3 = (dipatch, getState) => next => action => {};
~~~

那么如何让每个middleware持有最终的dispatch呢？ 闭包！

当你在一个函数声明范围内，持有一个声明外部的变量，那么就形成了一个闭包。而所有闭包内对变量的修改，都将会影响其它人。无论这个变量是对象或者是基本类型。

~~~JS
let dispatch = ()=>{};
const chain = [mid1,mid2,mid3].map(mid=>mid({ getState, dispatch(){ return dispatch }}));
~~~

得到的chain数组是：

~~~JS
mid1: next=>action=>{};
mid2: next=>action=>{};
mid3: next=>action=>{};
~~~

用compose串联起来：

~~~JS
compose(mid1, mid2, mid3);
~~~

那么如何触发这个调用栈呢？传入redux实现的dispatch即可

~~~JS
finalDispatch = compose([mid1, mid2, mid3])(redux.dispatch)
~~~

最后调用`finalDispatch(action)`，按照mid1->mid2->mid3->redux.dispatch调用，但是其实compose(f1,f2,f3)对应的是f1(f2(f3()))，也就是说调用顺序是f3->f2->f1，这是在传入的函数是一阶函数的情况下，当传入的是二阶函数的时候，我们首选传入redux.dispatch的时候：

~~~JS
mid3.next = redux.dispatch
mid2.next = mid3返回的函数
mid1.next = mid2返回的函数
~~~

事实上，我们compose得到的是一个二阶函数，当传入redux.dispatch的时候，实际上这个二阶函数被降级成一阶函数，此时mid1生成的函数处于调用栈的最上层，所以此时传入action的时候，调用会按照mid1->mid2->mid3->redux.dispatch调用。这样每一层mid都先执行自己的部分，而后再交给下一层进行处理，当然也可以选择直接跳回到第一层。

## 5.2 compose

> compose接收函数数组，返回一个函数
>
> 当compose执行的时候，按照函数数组从右像左执行，前一个函数执行返回的结果当作下个函数执行的参数
>
> `compose(funcA, funcB, funcC)`等价于`compose(funcA(funcB(funcC())))`

~~~TS
export default function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

~~~