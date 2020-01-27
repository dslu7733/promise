/*
  宏队列：
    定时器回调
    ajax回调
    dom事件回调

  微队列：
    Promise回调
    mutation回调
*/

// setTimeout(()=>{  //立即放入宏队列
//   console.log('timeout callback1（）')
//   Promise.resolve(3).then(
//     value => {  //立即放入微队列
//       console.log('Promise onResolved3()', value)
//     }
//   )
// },0)

// setTimeout(()=>{  //立即放入宏队列
//   console.log('timeout callback2（）')
// },0)

// Promise.resolve(1).then(
//   value => {  //立即放入微队列
//     console.log('Promise onResolved1()', value)
//     setTimeout(()=>{
//       console.log('timeout callback3（）', value)
//     },0)
//   }
// )

// Promise.resolve(2).then(
//   value => {  //立即放入微队列
//     console.log('Promise onResolved2()', value)
//   }
// )


//  先执行微队列
// Promise onResolved1() 1
// Promise onResolved2() 2
// timeout callback1（）
// timeout callback2（）
// timeout callback3（） 1
// Promise onResolved3() 3


/* ----------------------- */
setTimeout(()=>{
  console.log(1)
},0)

new Promise((resolve, reject) => {
  console.log(2)
  resolve()
}).then(
  value => {
    console.log(3)
  }
).then(
  value => {
    console.log(4)
  }
)

console.log(5)