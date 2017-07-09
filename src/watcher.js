// 监听者 订阅对象
class Watcher {
	constructor (vm, exp, cb) {
		this.cb = cb
		this.vm = vm
		this.exp = exp //title name
		this.value = this.get ()
	}
	get () {
		Dep.target = this
		let value = this.vm.data[this.exp]
		Dep.target = null
		return value
	}
	update () {
		this.run ()
	}
	run () {
		let value = this.vm.data[this.exp]
		let oldVal = this.value
		if(value !== oldVal) {
			this.cb.call(this.vm, value, oldVal)
		}

	}
}