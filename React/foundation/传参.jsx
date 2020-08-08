import PropTypes from "prop-types";

export class example extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { userName: this.props.userName };
  }
  render() {
    return (
      <div>
        {/* 传参的三种方式 */}
        <Button onClick={this.delEvent1.bind(this, "abc")}>A</Button>
        <Button onClick={this.delEvent2("abc")}>B</Button>
        <Button onClick={(e) => this.delEvent3("abc", e)}>C</Button>
        <input
          value={this.state.useName}
          onChange={this.handleInputChange.bind(this)}
        />
      </div>
    );
  }

  //实现类似双向绑定的效果
  handleInputChange(e) {
    const userName = event.target.value;
    this.setState(() => ({
      userName,
    }));
    //下面这种写法报错，因为this.setState传递一个函数时，为异步方法，等异步执行时已经没有event
    // this.setState(() => ({
    //     userName = event.target.value
    // }))
  }
  delEvent1(name, e) {
    alert(name);
  }
  delEvent2 = (name) => (e) => {
    alert(name);
  };
  delEvent3 = (name, e) => {
    alert(name);
  };
}

// 对传递的参数强校验
example.propTypes = {
  userName: PropTypes.string.isRequired, // 限制为字符串且必传
};
