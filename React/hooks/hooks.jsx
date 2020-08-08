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
