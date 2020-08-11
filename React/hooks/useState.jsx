let workInProgressHook;
let isMount = true;

// App组件对应的fiber对象
const fiber = {
  // 保存该FunctionComponent对应的Hooks链表
  memoizedState: null,
  // 指向App函数
  stateNode: App,
};

function schedule() {
  workInProgressHook = fiber.memoizedState;
  const app = fiber.stateNode();
  isMount = false;
  return app;
}

//当有一个update产生的时候，会触发dispatch，将当前update加入到环状链表中
function dispatchAction(queue, action) {
  //每一个update都是一个对象
  const update = {
    action, //更新执行
    next: null, //和同一个hook的其他update形成环状单向链表
  };
  //当前queue中目前没有update对象
  if (queue.pending === null) {
    update.next = update;
  } else {
    //加入到链表尾部
    update.next = queue.pending.next;
    queue.pending.next = update;
  }
  queue.pending = update;

  // 模拟React开始调度更新
  schedule();
}

function useState(initialState) {
  let hook;

  //isMount为true代表是首次render，mount时需要生成hook对象
  if (isMount) {
    hook = {
      queue: {
        pending: null,
      },
      memoizedState: initialState,
      next: null,
    };
    // 将hook插入fiber.memoizedState链表末尾
    if (!fiber.memoizedState) {
      fiber.memoizedState = hook;
    } else {
      workInProgressHook.next = hook;
    }
    // 移动workInProgressHook指针
    workInProgressHook = hook;
  } else {
    // update时找到对应hook
    hook = workInProgressHook;
    // 移动workInProgressHook指针
    workInProgressHook = workInProgressHook.next;
  }

  //当找到该useState对应的hook后，如果该hook.queue.pending不为空（即存在update），则更新其state
  // update执行前的初始state
  let baseState = hook.memoizedState;
  if (hook.queue.pending) {
    // 获取update环状单向链表中第一个update
    let firstUpdate = hook.queue.pending.next;

    do {
      // 执行update action
      const action = firstUpdate.action;
      baseState = action(baseState);
      firstUpdate = firstUpdate.next;
      // 最后一个update执行完后跳出循环
    } while (firstUpdate !== hook.queue.pending);

    // 清空queue.pending
    hook.queue.pending = null;
  }
  // 将update action执行完后的state作为memoizedState
  hook.memoizedState = baseState;

  return [baseState, dispatchAction.bind(null, hook.queue)];
}

function App() {
  const [num, updateNum] = useState(0);

  console.log(`${isMount ? "mount" : "update"} num: `, num);

  return {
    click() {
      updateNum((num) => num + 1);
    },
  };
}

window.app = schedule();
