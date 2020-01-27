/* 测试官方Promise对象的回调函数数组 */

const p = new Promise((resolve, reject) => {
  setTimeout(()=>{
    resolve(1)
  }, 3000)
})

p.then(
  value => console.log('value1', value),
  reason => console.log('reason', reason)
)

p.then(
  value => console.log('value2', value),
  reason => console.log('reason', reason)
)
/*
output:
value1 1
value2 1
*/


new Promise((resolve, reject) => {
  return new Promise((resolve, reject) => {
    console.log('....') //不输出
    resolve(1)
  })
})



/* 通过实例a1改变实例a2的状态 */

function a(excutor){
  this.data = []
  this.status = 'init'
  const self = this

  function wait(){
    self.status = 'wait'
  }

  function run(){
    self.status = 'run'
  }

  excutor(wait, run)
}

a.prototype.change = function(){
  const self = this
  return new a((wait, run)=>{
    function handle(){
      run()
    }

    self.data.push(handle)
  })
}


var a1 = new a((x,y)=>{})
var a2 = a1.change()
console.log(a1)
console.log(a2)

a1.data[0]()
console.log(a1)
console.log(a2)

// a { data: [ [Function: handle] ], status: 'init' }
// a { data: [], status: 'init' }
// a { data: [ [Function: handle] ], status: 'init' }
// a { data: [], status: 'run' }
