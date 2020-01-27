/*
  1.async function (function return Promise)
    函数返回Promise对象
    promise对象的结果由async函数执行的返回值决定
  
  2. await expression (value or Promise)
    expression一般是Promise对象，也可以是其他值
      如果是Promise对象，await返回的是Promise成功的值
      如果是其他值，直接将此值作为await的返回值

  3. 
    await必须写在async中，但async可以没有await
    如果await的Promise失败，就会抛出异常，需通过try...catch...捕获处理
*/


// async函数返回一个promise对象
async function fn1() {
  //return 1
  //throw 2
  //return Promise.resolve(3)
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      resolve(4)
    }, 1000)
  })
}

const result = fn1()
//console.log(result) //Promise { 1 }

result.then(
  value => {
    console.log('onResolved()', value)
  },
  reason => {
    console.log('onRejected()', reason)
  }
)


/*------------------------*/

function fn2(){
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      //resolve(4)
      reject(6)
    }, 1000)
  })
}

function fn4(){
  return 5
}

async function fn3(){
  //const value = await fn2() //await右侧表达式为Promise，得到的结果就是promise成功的value
  const value = await fn4() //await右侧表达式不为Promise，得到的结果就是它本身
  console.log('value', value)
}

fn3()

async function fn5(){
  try{
    const value = await fn2()
    console.log('fn5 value', value)
  }catch(error){  //捕获失败promise的结果
    console.log('fn5 error', error)
  }
}

fn5()