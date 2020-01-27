/* 1.error属于promise哪个状态 */
// const p = new Promise((resolve, reject)=>{
//   throw new Error('出错了') //属于reject状态
// })

// p.then(
//   value => {},
//   reason => { console.log('reason', reason) } //reason Error: 出错了
// )


/* 2.一个promise指定多个成功/失败回调函数 */
// const p2 = new Promise((resolve, reject)=>{
//   throw new Error('出错了') //属于reject状态
// })

// p2.then(
//   value => {},
//   reason1 => { console.log('reason1', reason1) } //reason1 Error: 出错了
// ).then(
//   reason2 => { console.log('reason2', reason2) }  //reason2 undefined
// )


/* 3.状态改变与指定回调函数的先后次序 */
// new Promise((resolve, reject)=>{
//   setTimeout(()=>{
//     resolve(1)  //后改变状态(同时指定数据),异步执行回调函数
//   },1000)
// }).then(  //先指定回调函数,保存当前指定的回调函数
//   value => {},
//   reason => { console.log('reason', reason) }
// )

// new Promise((resolve, reject)=>{
//     resolve(1)  //先改变状态(同时指定数据)
// }).then(  //后指定回调函数,异步执行回调函数
//   value => { console.log('value', value) },
//   reason => { console.log('reason', reason) }
// )
// console.log('-----')  //先输出----, 再输出value 1


/* 4.promise.then()返回的新promise的结果状态由什么决定 */
// new Promise((resolve, reject)=>{
//   resolve(1)
// }).then(
//   value => {
//     console.log("onResolved1()", value)
//     //return 2  //新Promise状态为resolved, return得到value值
//     //return Promise.resolve(3) //返回一个新promise, Promise是函数对象
//     throw 4   //新Promise状态为rejected, throw得到value值
//   }
// ).then(
//   value => {console.log("onResolved2()", value)},
//   reason => {console.log("onRejected2()", reason)}
// )



/* 5. 如何串联多个操作任务 */
new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('执行任务1(异步)')
    resolve(1)
  }, 1000)
}).then(
  value => {
    console.log('任务1的结果', value)
    console.log('执行任务2(同步)')
    return 2
  }
).then(
  value => {
    console.log('任务2的结果', value)

    return new Promise((resolve, reject) => {
      //启动任务3(异步)
      setTimeout(() => {
        console.log('执行任务3(异步)')
        resolve(3)
      }, 1000)
    })
  }
).then(
  value => {
    console.log('任务3的结果', value)
  }
)


/* 6. 异常传透 */
new Promise((resolve, reject) => {
  //resolve(1)
  reject(1)
}).then(
  value => {
    console.log('onResolved1()', value)
    return 2
  },
  //reason => Promise.reject(reason)
  reason => {
    throw reason
  } //默认failureCallback
).then(
  value => {
    console.log('onResolved2()', value)
    return 3
  }
).then(
  value => {
    console.log('onResolved3()', value)
  }
).catch(reason => {
  console.log('onRejected1()', reason)
})



/* 7. 中断Promise链 */
new Promise((resolve, reject) => {
  reject(1)
}).then(
  value => {
    console.log('onResolved1()', value)
    return 2
  }
).then(
  value => {
    console.log('onResolved2()', value)
    return 3
  }
).then(
  value => {
    console.log('onResolved3()', value)
  }
).catch(reason => {
  console.log('onRejected1()', reason)
  return new Promise(()=>{})  //返回一个pending的promise 中断promise链
}).then(
  value => { console.log('onResolved4()', value) },
  reason => { console.log('onRejected4()', reason)}
)