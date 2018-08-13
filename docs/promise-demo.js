class PromiseDemo {
  constructor(executor) {
    // 传入resolve与reject两个函数
    this.status = 'pending'
    this.data = null
    this.onResolvedCallBack = [] // resolve的回调函数列表
    this.onRejectedCallBack = [] //reject的回调函数列表
    const resolve = value => {
      // pending => resolved
      if (this.status === 'pending') {
        this.status = 'resolved'
        this.data = value
        for (let i = 0; i < this.onResolvedCallBack.length; i += 1) {
          this.onResolvedCallBack[i](value)
        }
      }
    }
    const reject = reason => {
      // pending => rejected
      if (this.status === 'pending') {
        this.status = 'rejected'
        this.data = reason
        for (let i = 0; i < this.onRejectedCallBack.length; i += 1) {
          this.onRejectedCallBack[i](reason)
        }
      }
    }
    try {
      executor(resolve, reject) // 执行executor
    } catch (error) {
      reject(error)
    }
  }
  then(onResolved, onRejected) {
    const self = this
    // 根据标准，如果then的参数不是function，则我们需要忽略它，此处以如下方式处理
    onResolved =
      typeof onResolved === 'function'
        ? onResolved
        : function(v) {
            return v
          }
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : function(r) {
            throw r
          }
    console.log(this.status, this.data)
    if (this.status === 'resolved') {
      // 如果promise1(此处即为this/self)的状态已经确定并且是resolved，我们调用onResolved
      // 因为考虑到有可能throw，所以我们将其包在try/catch块里
      return new PromiseDemo((resolve, reject) => {
        try {
          const x = onResolved(this.data)
          if (x instanceof PromiseDemo) {
            // 如果返回Promise对象，那取结果作为新Promise的结果
            x.then(resolve, reject)
          }
          resolve(x)
        } catch (error) {
          reject(error)
        }
      })
    }
    // 同 resolve情况，不过调用了reject函数
    if (this.status === 'rejected') {
      return new PromiseDemo((resolve, reject) => {
        try {
          const x = onRejected(this.data)
          if (x instanceof PromiseDemo) {
            // 如果返回Promise对象，那取结果作为新Promise的结果
            x.then(resolve, reject)
          }
        } catch (error) {
          reject(error)
        }
      })
    }

    // 如果当前的Promise还处于pending状态，我们并不能确定调用onResolved还是onRejected，
    // 只能等到Promise的状态确定后，才能确实如何处理。
    // 所以我们需要把两种情况的处理逻辑做为callback放入promise1(此处即this/self)的回调数组里
    // 逻辑本身跟第一个if块内的几乎一致，此处不做过多解释
    if (this.status === 'pending') {
      return new PromiseDemo(function(resolve, reject) {
        self.onResolvedCallBack.push(function(value) {
          try {
            const x = onResolved(self.data)
            if (x instanceof PromiseDemo) {
              x.then(resolve, reject)
            }
            // 此处不执行resolve函数，不改变promise的状态
          } catch (error) {
            reject(e)
          }
        })

        self.onRejectedCallBack.push(function(reason) {
          try {
            const x = onRejected(self.data)
            if (x instanceof PromiseDemo) {
              x.then(resolve, reject)
            }
          } catch (e) {
            reject(e)
          }
        })
      })
    }
  }
  catch(onRejected) {
    return this.then(null, onRejected)
  }
}

let mypromise = new PromiseDemo(function(resolve, reject) {
  setTimeout(() => resolve('aa'), 2000)
})
// const p = mypromise.then(() => {
//   console.log('first 1')
//   return new PromiseDemo(function(resolve, reject) {
//     resolve('second 2')
//   })
// })
// setTimeout(() => mypromise.then(() => console.log('first 3')), 5000)
mypromise = new PromiseDemo(function(resolve, reject) {
  if (Math.random() > 0.5) {
    resolve('ok')
  } else {
    reject('error')
  }
})
const res = mypromise.then(res => ({ ok: true, res })).catch(err => ({ ok: false, err }))
res.then(v => {
  console.log(v)
})
