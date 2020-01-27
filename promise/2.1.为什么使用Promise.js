/*
  对比不同回调方式(伪代码)
  1. 指定回调方式更加灵活
    旧的: 必须在启动异步任务前指定
  2. 支持链式调用,解决回调地狱
*/

function successCallback(result) {
  console.log('声音文件创建成功' + result)
}

function failureCallback(error) {
  console.log('声音文件创建失败' + error)
}

/* 1.1 纯回调函数 */
//启动任务(audioSettings)前必须指定回调函数(callback)
createAudioFileAsync(audioSettings, successCallback, failureCallback)

/* 1.2 promise */
//可在启动任务(audioSettings)后指定回调函数(callback)
const promise = createAudioFileAsync(audioSettings)
setTimeout(() => {
  promise.then(successCallback, failureCallback)
}, 1000)



/* 2.1 回调地狱 */
//回调函数的嵌套
doSomething(function (result) { //第一个函数function就是sucessCallback
  doSomethingElse(result, function (newResult) {
    doThirdThing(newResult, function (finalResult) {
      console.log('Got the final result' + finalResult)
    }, failureCallback)
  }, failureCallback)
}, failureCallback)


/* 2.2 链式调用 */
doSomething().then(function(result) { //result是doSomething函数成功执行的返回值
  return doSomethingElse(result)      //执行器函数,同步回调
})
.then(function(newResult){  //newResult是doSomethingElse成功执行的返回值
  return doThirdThing(newResult)
})
.then(function(finalResult){
  console.log('Got the final result' + finalResult)
})
.catch(failureCallback) //统一的错误处理


/* 2.3 async/await : 回调地狱的终极解决方案 */
//根本上去掉回调函数
async function request() {
  try{
    const result = await doSomething()
    const newResult = await doSomethingElse(result)
    const finalResult = await doThirdThing(newResult)
    console.log('Got the final result' + finalResult)
  } catch (error) {
    failureCallback(error)
  }
}
