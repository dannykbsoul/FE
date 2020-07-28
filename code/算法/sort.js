function quicksort(arr, start, end) {
  if (!Array.isArray(arr) || arr.length <= 1 || start > end) return;
  let index = partition(arr, start, end);
  // quicksort(arr, start, index - 1);
  // quicksort(arr, index + 1, end);
}

function partition(arr, l, r) {
  let pivot = arr[l],
    index = l;
  for (let i = l + 1; i <= r; i++) {
    if (arr[i] < pivot) {
      [arr[i], arr[++index]] = [arr[++index], arr[i]];
    }
  }
  [arr[index], arr[l]] = [arr[l], arr[index]];
  return index;
}

var arr = [6, 2, 3, 4, 1, 5];
partition(arr, 0, arr.length - 1);
console.log(arr);