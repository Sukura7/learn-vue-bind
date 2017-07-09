class Observer {
  constructor (data) {
    this.data = data
    this.walk(data)
  }
  walk (data) {
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }
  // 对dta对象的单个key 做数据劫持
  defineReactive(data, key, val) {
    let dep = new Dep()
    Object.defineProperty(data , key, {
      enumerable: true,
      configurable: true,
      get: function getter() {
        // 添加订阅的时候
        if(Dep.target) {
          dep.addSub(Dep.target)
        }
        return val;
      },
      set: function setter (newVal) {
        if(newVal === val) {
          return;
        }
        // 发布者要把回调函数给执行了
        // console.log('数据更新了');
        val = newVal;
        dep.notify();
      }
    })
  }
}
function observe(value) {
  // 实例化一个发布者
  if(!value || typeof value !== 'object') {
    return;
  }
  return new Observer(value)
}

class Dep {
  constructor () {
    this.subs = []
  }
  addSub (sub) {
    this.subs.push(sub);
  }
  notify () {
    this.subs.forEach(sub => {
      // update 的接口
      sub.update()
    })
  }
}
// 类的属性
Dep.target = null;
