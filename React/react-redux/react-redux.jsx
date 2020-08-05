import React from "react";
import PropTypes, { func } from "prop-types";

/**
 * provider：当前项目的"根"组件
 * 1.接收通过属性传递过来的store，把store挂载到上下文中，这样当前项目中任何一个组件中，
 * 想要使用redux中的store，直接通过上下文获取即可
 * 2.在组件的render中，把传递给provider的子元素渲染，通过this.props.children可以获取到子元素
 */
class Provider extends React.Component {
  //需要声明静态属性childContextTypes来指定context对象的属性，是context的固定写法
  static childContextTypes = {
    store: PropTypes.object,
  };

  //实现getChildContext方法，返回context对象，也是固定写法
  getChildContext() {
    return {
      store: this.props.store,
    };
  }
  constructor(props, context) {
    super(props, context);
  }

  //渲染被Provider包裹的组件
  render() {
    return this.props.children;
  }
}

//export default connect(mapStateToProps, mapDispatchToProps)(TodoList);
//为什么不直接将TodoList当作第三个参数传入前面的，主要考虑到connect的装饰器写法
/**
 * @connect 高阶组件(基于高阶函数:柯里化函数)创建的组件就是高阶组件
 * @param {*} mapStateToProps:回调函数，把redux中的部分状态信息挂载到指定组件的属性上
 * function mapStateToProps(state) {
 *    //state:redux容器中的状态信息
 *    return {}; //return对象中有啥，就把啥挂载到属性上
 * }
 * @param {*} mapDispatchToProps:回调函数，把一些需要派发的任务方法也挂载到组件的属性上
 * function mapDispatchToProps(dispatch) {
 *    //dispatch:store中的dispatch
 *    return {}; //return对象中有啥，就把啥挂载到属性上
 * }
 * @return
 *  返回一个新的函数connectHOT，传递进来的是要操作的组件，我们需要把指定的属性和方法挂载到当前组件的属性上
 */
function connect(mapStateToProps, mapDispatchToProps) {
  return function connectHOT(Component) {
    //返回一个新的组件，在新的组件Proxy中，我们要获取provider在上下文中存储的store，
    //紧接着获取store中的state和dispatch，把mapStateToProps、mapDispatchToProps回调函数执行，
    //接收返回的结果，再把这些结果挂载到component这个要操作组件的属性上
    return class Proxy extends React.Component {
      //接收context的固定写法
      static contextTypes = {
        store: PropTypes.object,
      };
      //获取store中的state/dispatch，把传递的两个回调函数执行，接收返回的结果
      constructor(props, context) {
        super(props, context);
        this.state = this.queryMountProps();
      }

      //基于redux中的subscribe向事件池中追加一个方法，当容器状态改变，我们需要重新获取最新的状态信息，并且重新把
      //Component组件渲染，把最新的状态信息通过属性传递给Component
      componentDidMount() {
        this.context.store.subscribe(() => {
          this.setState(this.queryMountProps());
        });
      }

      //渲染Component组件，并且把获取的信息(状态、方法)挂载到组件属性上
      //{...this.state}将state中的每一项都传递给Component，单独调取Proxy组件的时候传递的属性也给Component
      render() {
        return <Component {...this.state} {...this.props} />;
      }

      //从redux中获取最新的信息，基于回调函数筛选，返回的是需要挂载到组件属性上的信息
      queryMountProps = () => {
        let { store } = this.context,
          state = store.getState();
        let propsState =
          typeof mapStateToProps === "function" ? mapStateToProps(state) : {};
        let propsDispatch =
          typeof mapDispatchToProps === "function"
            ? mapDispatchToProps(store.dispatch)
            : {};
        return {
          ...propsState,
          ...propsDispatch,
        };
      };
    };
  };
}

export { Provider, connect };

//举个例子🌰

//加上react-redux，可以完全将有状态组件变成无状态组件
//没有生命周期函数，也不用生成component实例，优化了性能
const TodoList = (props) => {
  let {
    inputValue,
    list,
    handleInputChange,
    handleClick,
    handleDeleteClick,
  } = props;
  return (
    <div>
      <div>
        <input value={inputValue} onChange={handleInputChange} />
        <button onClick={handleClick}>提交</button>
      </div>
      <ul>
        {list.map((item, index) => {
          return (
            <li
              key={index}
              onClick={() => {
                handleDeleteClick(index);
              }}
            >
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

//只有render，可以变成UI组件
// class TodoList extends Component {
//   render() {
//     let {
//       inputValue,
//       list,
//       handleInputChange,
//       handleClick,
//       handleDeleteClick,
//     } = this.props;
//     return (
//       <div>
//         <div>
//           <input value={inputValue} onChange={handleInputChange} />
//           <button onClick={handleClick}>提交</button>
//         </div>
//         <ul>
//           {list.map((item, index) => {
//             return (
//               <li
//                 key={index}
//                 onClick={() => {
//                   handleDeleteClick(index);
//                 }}
//               >
//                 {item}
//               </li>
//             );
//           })}
//         </ul>
//       </div>
//     );
//   }
// }

const mapStateToProps = (state) => {
  return {
    inputValue: state.inputValue,
    list: state.list,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleInputChange(e) {
      const action = {
        type: "change_input",
        value: e.target.value,
      };
      dispatch(action);
    },
    handleClick() {
      const action = {
        type: "add_item",
      };
      dispatch(action);
    },
    handleDeleteClick(index) {
      const action = {
        type: "delete_item",
        index,
      };
      dispatch(action);
    },
  };
};

//TodoList是一个UI组件，但是connect方法将UI组件和数据以及业务逻辑相结合得到了容器组件
export default connect(mapStateToProps, mapDispatchToProps)(TodoList);

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

// 经过compose后，compose(...chain)(store.dispatch) 会变成这样
compose(a, b, c);
a(b(c(store.dispatch)));

c(store.dispatch) = function cc(action) {
  console.log("c进入");
  store.dispatch(action);
  console.log("c离开");
};

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

// 当我再用store.dispatch发送一个action的时候，action会作为function aa 的参数，然后执行aa函数
// 此时，所有的中间件就会执行了，先执行a，然后b，然后c
store.dispatch(action) = (function aa(action) {})(action);

function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

var arr = [(a) => a + 1, (b) => b * 10];
console.log(compose(...arr)(1));
