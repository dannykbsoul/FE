//阶乘
const factorial1 = n => {
    if (n <= 1) return 1
    return n * factorial1(n - 1)
}
//阶乘尾递归优化
const factorial2 = (n, total = 1) => {
    if (n <= 1) return total;
    return factorial2(n - 1, total * n);
}

//斐波那契
//递归
function fib1(n) {
    if (n === 1 || n === 2) return n - 1;
    return fib1(n - 1) + fib1(n - 2);
}
console.log(fib1(3));
//非递归
function fib2(n) {
    let pre = 0,
        cur = 1;
    for (let i = 2; i <= n; i++) {
        [pre, cur] = [cur, pre + cur];
    }
    return pre;
}
console.log(fib2(3));