/*
自定义Promise函数模块: IFFE
es5定义模块方法: 匿名函数(自)调用
*/

(function (window) {

  const PENDING = 'pending'
  const RESOLVED = 'resolved'
  const REJECTED = 'rejected'

  /*
  Promise构造函数
  excutor: 执行器函数(同步执行), 含2个参数(resolve, reject) => {}
  */
  function Promise(excutor) {
    const self = this //令函数resolve内的self与Promise的self一致

    self.status = PENDING //satus属性,初始为pending
    self.data = undefined //给promise对象指定一个用于存储结果数据的属性
    self.callbacks = [] //每个元素的结构: {onResolved(value){}, onRejected(reason){} }

    function resolve(value) {
      //如果当前状态不是pending,直接结束
      if (self.status !== PENDING) {
        return
      }

      //将状态改为resolved
      self.status = RESOLVED
      //保存value数据
      self.data = value
      //如果有待执行的callback函数,立刻异步执行回调函数
      if (self.callbacks.length > 0) {
        setTimeout(() => { //放入队列中执行所有成功的回调函数
          self.callbacks.forEach(callbacksObj => {
            callbacksObj.onResolved(value)
          });
        })
      }
    }

    function reject(reason) {
      //如果当前状态不是pending,直接结束
      if (self.status !== PENDING) {
        return
      }

      //将状态改为rejected
      self.status = REJECTED
      //保存reason数据
      self.data = reason
      //如果有待执行的callback函数,立刻异步执行回调函数onRejected
      if (self.callbacks.length > 0) {
        setTimeout(() => { //放入队列中执行所有失败的回调函数
          self.callbacks.forEach(callbacksObj => {
            callbacksObj.onRejected(reason)
          });
        })
      }
    }

    //立即同步执行excutor
    try {
      excutor(resolve, reject)
    } catch (error) { //如果执行器抛出异常,Promise对象变为rejected状态
      reject(error)
    }

  }


  /*
  Promise原型对象的then()
  指定成功和失败的回调函数
  返回一个新的promise对象，结果由onResolved/onRejected的执行结果决定
  onResolved回调函数: value => {}
  onRejected回调函数: reason => {}
  */
  Promise.prototype.then = function (onResolved, onRejected) {

    onResolved = typeof onResolved === 'function' ?
      onResolved : value => value

    //指定默认是失败回调
    onRejected = typeof onRejected === 'function' ?
      onRejected : reason => {
        throw reason
      }

    const self = this

    //返回一个新的promise对象
    //(状态改变) 
    return new Promise((resolve, reject) => {

      /*
      调用指定的回调函数处理,根据执行的结果,改变return的promise状态
      callback回调函数: data => {}
      */
      function handle(callback) {
        /*
          1. 如果抛出异常,return的promise就会失败,reason就是error
          2. 如果回调函数返回不是promise, return的promise就会成功,value就是返回值
          3. 如果回调函数返回的是promise, return的promise结果就是这个promise的结果
          */
        try {
          const result = callback(self.data)

          if (result instanceof Promise) {
            //3. 如果回调函数返回的是promise, return的promise结果就是这个promise的结果
            // result.then(
            //   value => resolve(value),  //当result成功,让return的promise也成功( x=>fn(x), 将fn(x)的返回值返回)
            //   reason => reject(reason)  //当result失败,让return的promise也失败
            // )
            result.then(resolve, reject) //将result的结果当作新Promise的结果（这里的resolve/reject是控制新promise的回调函数）
          } else {
            //2. 如果回调函数返回不是promise, return的promise就会成功,value就是返回值
            resolve(result)
          }
        } catch (error) {
          //1. 如果抛出异常,return的promise就会失败,reason就是error
          reject(error)
        }
      }

      //当前状态为pending, 保存回调函数
      if (self.status === PENDING) { //这里的self不是新promise的this
        self.callbacks.push({
          onResolved(value) {
            handle(onResolved)
          },
          onRejected(reason) {
            handle(onRejected)
          }
        })
      } else if (self.status === RESOLVED) {
        setTimeout(() => {
          handle(onResolved)
        })
      } else { // REJECTED
        setTimeout(() => {
          handle(onRejected)
        })
      }
    })
  }


  /*
  Promise原型对象的catch()
  指定失败的回调函数
  返回一个新的promise对象
  */
  Promise.prototype.catch = function (onRejected) {
    return this.then(undefined, onRejected)
  }


  /*
  Promise函数对象的resolve方法
  返回一个指定结果的成功的promise
  */
  Promise.resolve = function (value) {
    //返回一个失败/成功的promise
    return new Promise((resolve, reject) => {
      //value是promise
      if (value instanceof Promise) { //使用value的结果作为promise的结果
        value.then(resolve, reject)
      } else { //value不是promise => promise成功，数据是value
        resolve(value)
      }
    })
  }


  /*
  Promise函数对象的reject方法
  返回一个指定reason的失败的promise
  */
  Promise.reject = function (reason) {
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }


  /*
  Promise函数对象的all方法
  返回一个promise,只有当所有promise成功时才成功
  */
  Promise.all = function (promises) {
    const values = new Array(promises.length) //用来保存所有成功value的数组
    //用来保存成功promise的数量
    let resolveCount = 0
    //返回新的promise
    return new Promise((resolve, reject) => {
      //遍历promises获取每个promise的结果
      promises.forEach((p, index) => {
        Promise.resolve(p).then( //p可以是数值
          value => {
            resolveCount++ //成功数量加1
            //p成功，将成功的value保存进values
            //values.push(value)  //push的value不能通过索引index获得
            values[index] = value

            // 如果全部成功，将return的promise改为成功
            if (resolveCount === promises.length) {
              resolve(values)
            }
          },
          reason => { //只有一个失败，return的promise就失败
            reject(reason) //无论reject还是resolve都只会执行一次，因为一个promise的结果一旦确定（resolved or rejected），就不可改
          }
        )
      })
    })
  }


  /*
  Promise函数对象的race方法
  返回一个promise,其结果由第一个完成的promsie决定
  */
  Promise.race = function (promises) {
    //返回一个新的promise对象
    return new Promise((resolve, reject) => {
      promises.forEach((p, index) => { //forEach函数内部是异步的
        Promise.resolve(p).then(
          value => {
            resolve(value)
          },
          reason => {
            reject(reason)
          }
        )
      })
    })
  }

  /*
  工具方法（函数方法）
  将setTimeout 与 resolve封装一起
  返回一个promise对象，它在指定的时间后才确定结果
  */
  Promise.resolveDelay = function (value, time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (value instanceof Promise) {
          value.then(resolve, reject)
        } else {
          resolve(value)
        }
      }, time)
    })
  }


  /*
  返回一个promise对象，它在指定的时间后才失败
  */
  Promise.rejectDelay = function (value, time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(value)
      }, time)
    })
  }


  window.Promise = Promise
})(window)