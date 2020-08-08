//一个函数接受一个组件作为参数，经过一系列加工后，最后返回一个新的组件
const HOCFactory = (Component) => {
  class HOC extends React.Component {
    // 在此定义多个组件的公共逻辑
    render() {
      return <Component {...thi.props} />; // 返回拼装的结果
    }
  }
  return HOC;
};
const MyComponent1 = HOCFactory(WrappedComponent1);
const MyComponent2 = HOCFactory(WrappedComponent2);

/**
 *
 * @param {*} Component
 * example1
 */
const withMouse = (Component) => {
  class withMouseComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = { x: 0, y: 0 };
    }
    handleMouseMove = (event) => {
      this.setState({
        x: event.clientX,
        y: event.clientY,
      });
    };
    render() {
      return (
        <div style={{ height: "500px" }} onMouseMove={this.handleMouseMove}>
          {/* 1. 透传所有 props 2. 增加 mouse 属性 */}
          <Component {...this.props} mouse={this.state} />
        </div>
      );
    }
  }
  return withMouseComponent;
};

const App = (props) => {
  const a = props.a;
  const { x, y } = props.mouse; // 接收 mouse 属性
  return (
    <div style={{ height: "500px" }}>
      <h1>
        The mouse position is ({x}, {y})
      </h1>
      <p>{a}</p>
    </div>
  );
};
export default withMouse(App); // 返回高阶函数

/**
 *
 * @param {*} WrappedComponent
 * example2
 */
const withUser = (WrappedComponent) => {
  const user = sessionStorage.getItem("user");
  return (props) => <WrappedComponent user={user} {...props} />;
};
const UserPage = (props) => (
  <div class="user-container">
    <p>My name is {props.user}!</p>
  </div>
);

export default withUser(UserPage);
