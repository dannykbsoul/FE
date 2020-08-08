import Child from "components/child";

class DataProvider1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = { target: "zj" };
  }

  render() {
    return <div>{this.props.render(this.state)}</div>;
  }
}

<DataProvider1 render={(data) => <Child target={data.target} />} />;

class DataProvider2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = { target: "zj" };
  }

  render() {
    return <div>{this.props.children(this.state)}</div>;
  }
}

//大家更习惯于写成这样
<DataProvider2>{(data) => <Child target={data.target} />}</DataProvider2>;

//DataProvider组件包含了所有跟状态相关的代码，而Child组件则可以是一个单纯的UI组件
//这样一来DataProvider就能单独复用了
