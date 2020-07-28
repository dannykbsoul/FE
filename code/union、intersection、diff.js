let a = new Set([1, 2, 3, 4]);
let b = new Set([3, 4, 5, 6]);

//并集
let union = new Set([...a, ...b]);
console.log(union)
//交集
let intersection = [...a].filter(x => b.has(x));
console.log(intersection);
//差集
let diff = [...a].filter(x => !b.has(x));
console.log(diff);