//一个函数接受一个组件作为参数，经过一系列加工后，最后返回一个新的组件
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
