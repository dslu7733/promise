/*
1. Promise.resolve
    返回一个成功/失败的promise对象

2. Promise.reject
    返回一个失败的promise对象

3. Promise.all方法: (promises) => {}
    promises: 包含n个promise的数组
    说明: 返回一个新的promise, 只有所有的promise都成功才成功

4. Promise.race方法: (promises) => {}
    promises: 包含n个promise的数组
    说明: 返回一个新的promise, 第一个完成的promise的结果状态就是最终的结果状态
*/

new Promise( (resolve, reject) => {
  setTimeout( () => {
    resolve('成功') //resolve就像是一个传递数据的运输机
  }, 1000 )
})
.then( 
  value => {
    console.log('onResolved()1', value)
  }
)
.catch(
  reason => {
    console.log('onRejected()1', reason)
  }
)



const p1 = new Promise((resolve, reject) => {
  resolve(1)
})
const p2 = Promise.resolve(2)
const p3 = Promise.reject(3)
// p1.then( value => {console.log(value)} )
// p2.then( value => {console.log(value)} )
// p3.catch( reason => {console.log(reason)} )

//const pAll = Promise.all([p1,p2,p3])
const pAll = Promise.all([p1,p2])
pAll.then(
  values => {
    console.log('all onResolved()', values)
  },
  reason => {
    console.log('all onRejected()', reason)
  }
)


const pRace = Promise.race([p1,p2,p3])
pRace.then(
  value => {
    console.log('race onResolved()', value)
  },
  reason => {
    console.log('race onResolved()', reason)
  }
)
