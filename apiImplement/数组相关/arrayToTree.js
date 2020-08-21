const arr = [{
        id: 4,
        parent_id: null
    }, {
        id: 7,
        parent_id: 4
    }, {
        id: 2,
        parent_id: 4
    }, {
        id: 1,
        parent_id: 7
    },
    {
        id: 3,
        parent_id: 7
    }
]


function convertArrToTree(arr) {
    let map = new Map(),
        root;

    arr.forEach((item) => {
        map.set(item.id, item);
        item.children = [];
    })
    arr.forEach((item) => {
        if (item.parent_id) {
            let obj = map.get(item.parent_id);
            obj.children.push(map.get(item.id));
        } else root = item.id;
    })
    return map.get(root);
}
convertArrToTree(arr);

// 需要转换成tree
const tree = {
    id: 4,
    parent_id: null,
    children: [{
        id: 7,
        parent_id: 4,
        children: [{
            id: 1,
            parent_id: 7,
            children: []
        }, {
            id: 3,
            parent_id: 7,
            children: []
        }]
    }, {
        id: 2,
        parent_id: 4,
        children: []
    }]
}