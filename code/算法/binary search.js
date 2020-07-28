//要明确变量的含义
function binarySearch(arr, target) {
  let l = 0,
    r = arr.length - 1; //我们要在[l...r]中寻找target，要清楚的知道l、r的定义

  while (l <= r) { //当l===r时，区间[l...r]依然是有效的
    let mid = Math.floor(l + (r - l) / 2);
    if (arr[mid] === target) return mid;
    else if (target > arr[mid]) l = mid + 1; //target在[mid+1...r]中
    else r = mid - 1;
  }
  return -1;
}

function binarySearch(arr, target) {
  let l = 0,
    r = arr.length; //我们要在[l...r)中寻找target

  while (l < r) { //当l===r时，区间[l...r)就变得无效了
    let mid = Math.floor(l + (r - l) / 2);
    if (arr[mid] === target) return mid;
    else if (target > arr[mid]) l = mid + 1; //target在[mid+1...r)中
    else r = mid; //target<arr[mid]，注意此时r应该更新为mid，而不是mid-1，因为右边是开区间，其实也没有包含到mid
  }
  return -1;
}

function left_bound(arr, target) {
  let l = 0,
    r = arr.length - 1;

  while (l <= r) {
    let mid = Math.floor(l + (r - l) / 2);
    if (arr[mid] === target) r = mid - 1;
    else if (target > arr[mid]) l = mid + 1;
    else r = mid - 1;
  }
  if (l >= arr.length || arr[l] !== target) return -1;
  return l;
}

function right_bound(arr, target) {
  let l = 0,
    r = arr.length - 1;

  while (l <= r) {
    let mid = Math.floor(l + (r - l) / 2);
    if (arr[mid] === target) l = mid + 1;
    else if (target > arr[mid]) l = mid + 1;
    else r = mid - 1;
  }
  if (r < 0 || arr[r] !== target) return -1;
  return r;
}