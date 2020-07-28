let x = 1;

function A(y) {
  let x = 2;

  function B(z) {
    console.log(x + y + z);
  }
  return B;
}
let C = A(2);
C(3);

/*第一步：创建全局执行上下文，并将其压入ECStack中*/
//  ECStack = [
//    //=>全局执行上下文
//    EC(G) = {
//      //=>全局变量对象
//      VO(G): {
//        ... //=>包含全局对象原有的属性
//        x = 1;
//        A = function (y) {
//          ...
//        };
//        A[[scope]] = VO(G); //=>创建函数的时候就确定了其作用域
//      }
//    }
//  ];

/*第二步：执行函数A(2)*/
//  ECStack = [
//    //=>A的执行上下文
//    EC(A) = {
//      //=>链表初始化为：AO(A)->VO(G)
//      [scope]: VO(G)
//      scopeChain: < AO(A),
//      A[[scope]] >
//      //=>创建函数A的活动对象
//      AO(A): {
//        arguments: [0: 2],
//        y: 2,
//        x: 2,
//        B: function (z) {
//          ...
//        },
//        B[[scope]] = AO(A);
//        this: window;
//      }
//    },
//    //=>全局执行上下文
//    EC(G) = {
//      //=>全局变量对象
//      VO(G): {
//        ... //=>包含全局对象原有的属性
//        x = 1;
//        A = function (y) {
//          ...
//        };
//        A[[scope]] = VO(G); //=>创建函数的时候就确定了其作用域
//      }
//    }
//  ];

/*第三步：执行B/C函数 C(3)*/
//  ECStack = [
//    //=>B的执行上下文
//    EC(B) {
//      [scope]: AO(A)
//      scopeChain: < AO(B), AO(A), B[[scope]]
//      //=>创建函数B的活动对象
//      AO(B): {
//        arguments: [0: 3],
//        z: 3,
//        this: window;
//      }
//    },
//    //=>A的执行上下文
//    EC(A) = {
//      //=>链表初始化为：AO(A)->VO(G)
//      [scope]: VO(G)
//      scopeChain: < AO(A),
//      A[[scope]] >
//      //=>创建函数A的活动对象
//      AO(A): {
//        arguments: [0: 2],
//        y: 2,
//        x: 2,
//        B: function (z) {
//          ...
//        },
//        B[[scope]] = AO(A);
//        this: window;
//      }
//    },
//    //=>全局执行上下文
//    EC(G) = {
//      //=>全局变量对象
//      VO(G): {
//        ... //=>包含全局对象原有的属性
//        x = 1;
//        A = function (y) {
//          ...
//        };
//        A[[scope]] = VO(G); //=>创建函数的时候就确定了其作用域
//      }
//    }
//  ];