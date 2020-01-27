/*
Promise是JS中进行异步编程的新的解决方案
  语法上: Promise是一个构造函数
  功能上: Promise对象用来封装一个异步操作并可以获得其结果  

Promise状态 
  成功:resolved  失败:rejected
  无论成功还是失败,都会有一个结果数据(value or reason)
                                                                                    then()                 
                                成功,执行resolve() > Promise对象(resolve状态) > 回调onResolved()                
  new Promise() > 执行异步操作 {                                                                } 新的Promise对象            
                                失败,执行reject()  > Promise对象(reject状态)  > 回调onRejected()           
                                                                               then()/catch()              

Promise基本使用
*/


//1.创建一个新的promise对象
//尽量使用const变量
const p = new Promise((resolve, reject) => { //执行器函数是同步回调!
  console.log('执行 excutor') //立刻执行
  //2.执行异步操作
  setTimeout(() => {  
    const time = Date.now()
    //3.1 成功,调用resolve(value)
    if( time % 2 === 0 ){
      resolve('成功的数据,time=' + time)
    } else {
    //3.2 失败,调用reject(reason)
      reject('失败的数据,time=' + time)
    }
  }, 1000)
})
console.log('new Promise()之后')  //先输出执行 excutor

p.then(
  value => { //接收得到成功的value
    console.log('成功的回调', value)
  },
  reason => { //接收失败得到的reason
    console.log('失败的回调', reason)
  }
)