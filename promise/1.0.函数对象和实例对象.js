/*
参考教程： https://www.bilibili.com/video/av77292118
函数对象：将函数作为对象使用
实例对象：new 函数产生的对象(执行构造函数)
*/

function Fn( name ) {
  this.name = name
  this.sayName = function(){
    console.log(this.name)
  }
}

const fn = new Fn('a')  //Fn是构造函数，fn是对象实例
fn.sayName()            // a
const res = Fn('b')     //Fn是普通函数调用, res是函数返回值
console.log(res)        // undefined

console.log(Fn.prototype) //Fn {}


/*
  call函数可以用来调用另一个对象的方法（包括构造函数）
*/
Fn.call({name:'c'}) //Fn是函数对象
var bird = {
  fly : function(){
    console.log( this.name + ' can fly.')
  }
}
var eagle = {
  name : 'eagle'
}
bird.fly.call(eagle)  //eagle can fly



/*
 工厂模式
 可以通过在函数内构建一个对象并返回的方法，
 使得通过普通的函数调用也能得到一个对象
*/

function Person(name){
  var p = new Object()
  p.name = name
  p.getName = function(){
    console.log(p.name)
  }
  return p
}

var p1 = new Person('xiao')
var p2 = Person('lili')

p1.getName()  //xiao
p2.getName()  //lili