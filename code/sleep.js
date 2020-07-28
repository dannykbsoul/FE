//promise
const sleep1 = time => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  })
}
sleep1(1000).then(() => console.log(1));

//generator
function* sleep2(time) {
  yield new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}
sleep2(1000).next().value.then(() => {
  console.log(1)
});

//async await
async function sleep3(time, func) {
  await new Promise(resolve => setTimeout(resolve, time))
  return func()
}
sleep3(1000, () => {
  console.log(1)
})

//cb
function sleep4(time, cb) {
  setTimeout(cb, time);
}

sleep4(1000, () => {
  console.log(1)
});