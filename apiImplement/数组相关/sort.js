function InsertionSort(a, from, to) {
    for (var i = from + 1; i < to; i++) {
        var element = a[i];
        for (var j = i - 1; j >= from; j--) {
            var tmp = a[j];
            var order = comparefn(tmp, element);
            if (order > 0) {
                a[j + 1] = tmp;
            } else {
                break;
            }
        }
        a[j + 1] = element;
    }
};