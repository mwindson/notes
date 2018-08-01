const a = [1, 2, 3, 4, 5, 6, 7, 8]

const toPromise = item =>
  new Promise((resolve, reject) => {
    try {
      setTimeout(() => resolve(item), (8 - item) * 1000)
    } catch (error) {
      reject(error)
    }
  })

// 同步发出请求，按顺序输出
const promiseArray = a.map(item => toPromise(item))
const res = promiseArray.reduce(
  (prev, current) => prev.then(() => current).then(v => console.log(v)),
  Promise.resolve()
)
// 按顺序发出请求和输出
a.reduce((prev, current) => prev.then(() => toPromise(current)).then(v => console.log(v)), Promise.resolve())
