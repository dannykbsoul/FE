// 此时页面上的 count 永远是 1，因为 useEffect 的依赖数组重没有包含 count。
// 导致定时器中 count 永远是第一次渲染时的值，即 0 。页面上一直为 0+1 = 1
function Counter() {
  let [count, setCount] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setCount(count + 1);
    }, 1000);
  }, []);

  return <h1>{count}</h1>;
}

// 加上count
// 依赖数组中加入了count，导致count一有变化，就会生成一个新的定时器
function Counter() {
  let [count, setCount] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setCount(count + 1);
    }, 1000);
  }, [count]);

  return <h1>{count}</h1>;
}

// 在return中移除上一次的定时器
function Counter() {
  let [count, setCount] = useState(0);

  useEffect(() => {
    let id = setInterval(() => {
      setCount(count + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [count]);

  return <h1>{count}</h1>;
}

// 用箭头函数来更新count，就不用上面这个方法反复创建和销毁定时器了，很耗费性能
function Counter() {
  let [count, setCount] = useState(0);

  useEffect(() => {
    let id = setInterval(() => {
      setCount((count) => count + 1);
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return <h1>{count}</h1>;
}

// 思考一下下面这种写法
// 看似没有把 count 放入依赖数组中，但不使用依赖数组的情况下，
// useEffect 会在第一次渲染之后和每次更新之后都会执行。这就使得每次渲染都能拿到最新的 count 值，这样就能实现定时器效果了。
function Counter() {
  let [count, setCount] = useState(0);

  useEffect(() => {
    let id = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  });

  return <h1>{count}</h1>;
}

// 用useRef改进计时器

// 1.使用 Ref 保存变量： 因为函数组件每一次都会重新执行，保存一些每一次都需要的使用的变量就需要 Ref Hook
function App() {
  const [count, setCount] = useState(1);
  const timer = useRef();

  useEffect(() => {
    timer.current = setInterval(() => {
      setCount((count) => count + 1);
    }, 1000);
  }, []);

  useEffect(() => {
    if (count >= 10) {
      clearInterval(timer.current);
    }
  });

  return (
    <>
      <h1>count: {count}</h1>
    </>
  );
}

// 2.使用 Ref 保存上一个状态的值
function Counter() {
  const [count, setCount] = useState(0);

  const prevCountRef = useRef(-1);
  useEffect(() => {
    prevCountRef.current = count;
  });

  const prevCount = prevCountRef.current;

  return (
    <>
      <button
        onClick={() => {
          setCount((count) => count + 1);
        }}
      >
        add
      </button>
      <h1>
        Now: {count}, before: {prevCount}
      </h1>
    </>
  );
}
