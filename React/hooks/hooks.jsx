const { useEffect } = require('react');

/**
 *实现功能：
 *在resize事件触发时获取到当前的window.innerWidth
 *这个自定义的hooks可以在多个地方使用
 */
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [width]);

  return width;
}

/**
 * useState & useRef
 */

/**
 * useEffect
 * 类似于componentDidMount、componentWillUnmount、componentDidUpdate
 */
function App() {
  useEffect(() => {
    //第一次渲染结束执行 componentDidMount
    const handleScroll = () => {};
    window.addEventListener('scroll', handleScroll);
    return () => {
      //组件卸载之前执行 componentWillUnmount
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    console.log('每次渲染结束都会执行');
  });

  useEffect(() => {
    console.log('只有在count变化后才会执行');
  }, [count]);
}

//demo
import React, {
  memo,
  createContext,
  forwardRef,
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
  useImperativeMethods,
} from "react";

const TestContext = createContext("default");

const Comp = memo((props) => {
  useEffect(() => {
    console.log("comp updated");
  });

  const updateValue = () => {
    props.onChick(props.name + "1");
  };

  return <button onClick={updateValue}>button {props.name}</button>;
});

const ContextComp = forwardRef((props, ref) => {
  const [name] = useState("123");
  const context = useContext(TestContext);

  useEffect(() => {
    console.log("context comp updated");
  });

  useImperativeMethods(ref, () => ({
    method() {
      console.log("method invoked");
    },
  }));

  return (
    <p>
      {context} {name}
    </p>
  );
});

export default function App() {
  const [name, setName] = useState("jokcy");
  const [compName, setCompName] = useState("compName");

  const ref = useRef();

  useEffect(() => {
    console.log("component update");

    ref.current.method();

    // api.sub

    return () => {
      console.log("unbind");
    };
  }, [name]); // 去掉这个数组就会每次都调用

  //如果没有useCallback，那么每次app组件的重新渲染，必然会
  //使得里面的函数重新声明，那么传入到下面的Comp组件的compCallback
  //也会和前一次不一样，导致Comp组件的重新渲染
  const compCallback = useCallback(
    (value) => {
      setCompName(value);
    },
    [compName]
  ); // 演示没有`[compName]`每次Comp都会调用effect

  return (
    <>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Comp name={compName} onClick={compCallback} />
      <TestContext.Provider value={name}>
        <ContextComp ref={ref} />
      </TestContext.Provider>
    </>
  );
}
