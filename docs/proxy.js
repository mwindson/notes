class Observable {
  constructor() {
    this.observers = new Set()
  }
  observe(fn) {
    this.observers.add(fn)
  }
  create(obj) {
    const self = this
    return new Proxy(obj, {
      set(target, key, value, receiver) {
        const result = Reflect.set(target, key, value, receiver)
        self.observers.forEach(observer => observer())
        return result
      }
    })
  }
}
const observable = new Observable()
const person = observable.create({
  name: '张三',
  age: 20
})

function print() {
  console.log(`${person.name}, ${person.age}`)
}

observable.observe(print)
person.name = '李四'