/*
  参考MDN https://developer.mozilla.org/en-US/docs/Web/JavaScript

  错误类型
    Error: 所有错误的父类型
      最常见：ReferenceError TypeError

  错误处理
    捕获错误：try ... catch
    抛出错误: throw error

  错误对象

*/


/*
 1.常见内置错误
*/
//ReferenceError: 引用变量不存在
console.log(a) //ReferenceError: a is not defined


//TypeError: 数据类型不正确
var b = {}
b.xxx()  //TypeError: b.xxx is not a function


//RangeError: 数据值不在其所允许的范围内
function fn(){
  fn()
}
fn()  //RangeError: Maximum call stack size exceeded


//SyntaxError: 语法错误
// const c = """"  //SyntaxError: Unexpected string


/*
 vs code好用快捷键
 Alt+Shift+上/下键 ：快速复制一行
 Alt++上/下键 ：快速移动一行
 ctrl+shift+k ：删除一行
 ctrl+` : 回到终端
*/



/*
 2.错误处理
*/
//错误捕获
try {
  let d
  console.log(d.xxx)
} catch (error) { //可以通过调试查看error对象的属性
  console.log(error.message)
  //console.log(error.stack)
}
// 可以继续向下执行
console.log('出错之后')



//抛出错误
function something() {
  if (Date.now() % 2  ===  1 ){
    console.log('当前时间为奇数,可执行任务')
  } else {
    throw new Error('当前时间为偶数无法执行任务')
  }
}

//情况1 直接调用
something() //Error: 当前时间为偶数无法执行任务
console.log('something之后')  //不会继续这句代码（没有对异常进行处理）

//情况2 捕获处理异常
try {
  something()
} catch(error) {
  console.log(error.message)
}