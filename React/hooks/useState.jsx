/**
 *
 * @param {*} initialValue
 * 版本1
 * 我们发现点击按钮不会有任何响应，主要是我们实现的useState不具备存储
 * 每次重新执行app的时候，会重新执行useState，这时候里面的state还会是传入的初始值
 * 所以我们需要借助外部的一个变量才存储
 */
function useState(initialValue) {
  let state = initialValue;
  function dispatch(newState) {
    state = newState;
    render(<App />, document.getElementById("root"));
  }
  return [state, dispatch];
}

/**
 * 此时解决了单个hooks的问题，但是有多个useState，所以我们需要一个数组去存储state
 */
let _state;
function useState(initialValue) {
  _state = _state | initialValue;
  function setState(newState) {
    _state = newState;
    render(<App />, document.getElementById("root"));
  }
  return [_state, setState];
}

/**
 * 页面初次渲染，每次useState执行时都会将对应的setState绑定到对应的索引的位置，
 * 然后将初始state存入memoizedState中
 * 点击按钮时，会触发setCount 和 setAge，每个setState都有其对应索引的引用，因此
 * 触发对应的setState会改变对应位置的state的值。
 * 重新渲染依旧是依次执行useState，但是memoizedState中已经有了上一次的state值，
 * 因此初始化的值并不是传入的初始值而是上一次的值，这样就解释了为什么Hooks要确保在每一次
 * 渲染中都按照同样的顺序被调用，因为 memoizedState 是按 Hooks 定义的顺序来放置数据的，
 * 如果 Hooks 的顺序变化，memoizedState 并不会感知到。因此最好每次只在最顶层使用 Hook，
 * 不要在循环、条件、嵌套函数中调用 Hooks。
 */
let memoizedState = []; // hooks 的值存放在这个数组里
let cursor = 0; // 当前 memoizedState 的索引

function useState(initialValue) {
  memoizedState[cursor] = memoizedState[cursor] || initialValue;
  const currentCursor = cursor;
  function setState(newState) {
    memoizedState[currentCursor] = newState;
    cursor = 0;
    render(<App />, document.getElementById("root"));
  }
  return [memoizedState[cursor++], setState]; // 返回当前 state，并把 cursor 加 1
}

const App = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("zj");
  const [age, setAge] = useState(18);

  return (
    <>
      <p>You clicked {count} times</p>
      <p>Your age is {age}</p>
      <p>Your name is {name}</p>
      <button
        onClick={() => {
          setCount(count + 1);
          setAge(age + 1);
        }}
      >
        Click me
      </button>
    </>
  );
};

export default App;
