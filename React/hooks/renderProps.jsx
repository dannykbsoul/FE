import Child from "components/child";

class DataProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = { target: "zj" };
  }

  render() {
    return <div>{this.props.render(this.state)}</div>;
  }
}

<DataProvider render={(data) => <Child target={data.target} />} />;

//大家更习惯于写成这样
<DataProvider>{(data) => <Cat target={data.target} />}</DataProvider>;

//DataProvider组件包含了所有跟状态相关的代码，而Child组件则可以是一个单纯的UI组件
//这样一来DataProvider就能单独复用了
