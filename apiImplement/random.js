function shuffle(arr) {
  for (let i = arr.length; i; i--) {
    let random = Math.floor(Math.random() * i);
    [arr[i - 1], arr[random]] = [arr[random], arr[i - 1]];
  }
  return arr;
}