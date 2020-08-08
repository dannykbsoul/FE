class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      flag: true,
    };
    this.nameInputRef = React.createRef(); // 创建 ref
    this.fileInputRef = React.createRef(); // 创建 ref
  }
  render() {
    return (
      <div>
        {/* 这里使用 defaultValue 而不是value，使用 ref */}
        <input defaultValue={this.state.name} ref={this.nameInputRef} />
        <button onClick={this.alertName.bind(this)}>alert value</button>
        {/* file 类型的必须用 ref 获取 dom 来获取数据 */}
        <input type="file" ref={this.fileInputRef} />
      </div>
    );
  }
  alertName() {
    const ele = this.nameInputRef.current; // 通过 ref 获取 dom 节点
    alert(ele.value);
  }
}
