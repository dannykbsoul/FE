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
> 3. enhancer：你可以选择指定它来增强store的第三方功能 * 比如 middleware、time travel、persistence, Redux附带的唯一商店增强器是 `applyMiddleware()
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





# 4.combineReducers.ts

> 对于真实项目中，一开始项目比较小，所以可能会放在一个reducer中，但是随着项目的不断的扩大，会分成很多个reducer，但是redux中最终只能有一个reduer，所以我们需要考虑如何将reducer合并

用法：

~~~jsx
// 两个reducer
const aReducer = (state = initaState, action) => {}
const bReducer = (state = initbuanState, action) => {}

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

~~~TS
import compose from './compose'

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param middlewares The middleware chain to be applied.
 * @returns A store enhancer applying the middleware.
 *
 * @template Ext Dispatch signature added by a middleware.
 * @template S The type of the state supported by a middleware.
 */
export default function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, ...args) => {
    const store = createStore(reducer, ...args)
    let dispatch: Dispatch = () => {}

    const middlewareAPI = {
      getState: store.getState,
      dispatch: ·(action, ...args) => dispatch(action, ...args),
    }
    const chain = middlewares.map((middleware) => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch,
    }
  }
}

~~~



## 5.1 compose

> compose接收函数数组，返回一个函数
>
> 当compose执行的时候，按照函数数组从右像左执行，前一个函数执行返回的结果当作下个函数执行的参数

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