(function (window) {
  const PENDING = 'pending'
  const RESOLVED = 'resolved'
  const REJECTED = 'rejected'

  class Promise {

    constructor(excutor) {
      const self = this

      self.status = PENDING
      self.data = undefined
      self.callbacks = []

      function resolve(value) {
        if (self.status !== PENDING) {
          return
        }

        self.status = RESOLVED
        self.data = value

        if (self.callbacks.length > 0) {
          setTimeout(() => {
            self.callbacks.forEach(callbacksObj => {
              callbacksObj.onResolved(value)
            })
          })
        }
      }

      function reject(reason) {
        if (self.status !== PENDING) {
          return
        }

        self.status = REJECTED
        self.data = reason

        if (self.callbacks.length > 0) {
          setTimeout(() => {
            self.callbacks.forEach(callbacksObj => {
              callbacksObj.onRejected(reason)
            })
          })
        }
      }

      try {
        excutor(resolve, reject)
      } catch (error) {
        reject(error)
      }
    }

    then(onResolved, onRejected) {
      onResolved = typeof onResolved === 'function' ?
        onResolved : value => value

      onRejected = typeof onRejected === 'function' ?
        onRejected : reason => {
          throw reason
        }

      const self = this

      return new Promise((resolve, reject) => {
        function handle(callback) {
          try {
            const result = callback(self.data)

            if (result instanceof Promise) {
              result.then(resolve, reject)
            } else {
              resolve(result)
            }

          } catch (error) {
            reject(error)
          }
        }

        if (self.status === PENDING) {
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
        } else {
          setTimeout(() => {
            handle(onRejected)
          })
        }
      })
    }

    catch(onRejected){
      return this.then(undefined, onRejected)
    }

    static resolve(value){
      return new Promise((resolve, reject)=>{
        if (value instanceof Promise){
          value.then(resolve, reject)
        }else {
          resolve(value)
        }
      })
    }

    static reject(reason){
      return new Promise((resolve, reject)=>{
        reject(reason)
      })
    }

    static all(promises){
      const values = new Array(promises.length)
      let resolveCount = 0

      return new Promise((resolve, reject) => {
        promises.forEach((p,index)=>{
          Promise.resolve(p).then(
            value => {
              resolveCount++
              values[index] = value
              if( resolveCount === promises.length ){
                resolve(values)
              }
            }, 
            reason => {
              reject(reason)
            }
          )
        })
      })
    }

    static race(promises){
      return new Promise((resolve, reject)=>{
        promises.forEach((p,index)=>{
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

    static resolveDelay(value, time){
      return new Promise((resolve, reject)=>{
        setTimeout(()=>{
          if(value instanceof Promise){
            value.then(resolve, reject)
          }else{
            resolve(value)
          }
        }, time)
      })
    }


    static rejectDelay(reason, time){
      return new Promise((resolve, reject)=>{
        setTimeout(()=>{
          reject(reason)
        }, time)
      })
    }
  }

})(window)