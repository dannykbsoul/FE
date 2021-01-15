// function count(str) {
//     // write code here
//     let res = Infinity,
//         map = new Map();
//     for (let i = 0; i < str.length; i++) {
//         let c = str[i];
//         if (map.get(c) != undefined) {
//             let index1 = map.get(c);
//             if (i - index1 - 1 < res) res = i - index1 - 1;
//         }
//         map.set(c, i);
//     }
//     if (res === Infinity) return -1;
//     else return res;
// }
// count("是我，我是中国人，我中国人")

// function rotate(str) {
//     // write code here
//     str = str.split(':').map(i => +i);
//     if (str[0] >= 12) str[0] -= 12;
//     let x = 30 * str[0] + 0.5 * str[1],
//         y = 6 * str[1];
//     if (x > y) return Math.floor(x - y);
//     else return Math.floor(y - x);
// }

function getMaxFilmCost(film) {
    // write code here
    const map = {
        'A': 10,
        'B': 25,
        'C': 5,
        'D': 15,
        'E': 40,
        'F': 30
    };
    return Math.max(...film.map(arr => {
        // console.log(arr)
        return arr.reduce((pre, cur) => {
            console.log(pre)
            return pre + map[cur];
        }, 0)
    }))
}
console.log(getMaxFilmCost([
    ["A", "B", "C"],
    ["B", "E"]
]))

function getMinDistance(arrs) {
    // write code here
    let res = Infinity,
        len = arrs.length;
    for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
            let now = Math.pow(arrs[i][0] - arrs[j][0], 2) + Math.pow(arrs[i][1] - arrs[j][1], 2);
            if (now < res) res = now;
        }
    }
    return Math.floor(Math.sqrt(res));
}