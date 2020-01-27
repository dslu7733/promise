/*
  同步回调：立即执行，直到执行结束。不会放到回调队列
  异步回调：不立即执行，而是放到回调队列中将来执行

  回调函数就是一个通过函数指针调用的函数，通俗理解就是参数是函数的函数,
  进一步地，根据函数参数执行的先后顺序划分出了同步和异步回调
*/

//同步回调
const arr = [1,2,3]
arr.forEach( item => {  //遍历回调
  console.log(item)     //不进入回调队列，立刻执行
} )
console.log('forEach之后')  //先输出1 2 3


//异步回调
setTimeout( () => {
  console.log('timeout callback()') //这个函数进入回调队列排队
}, 0)
//总是执行完下面的代码，最后才执行回调队列里面的函数
console.log('setTimeout()之后') //最后才输出 timeout callback()

//Promise.then执行回调函数 就是一个异步调用的例子


