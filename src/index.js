class SelfVue {
	// 配置参数对象 Object
	constructor(options) {
		// 数据的解析及监听改变
		this.data = options.data || {}
		// 将事件做监听
		this.methods = options.methods
		// 创建发布者
		observe(this.data)
		// 当前面的都OK后 生命周期函数就是个钩子，最后执行一下就可以
		// 传参的时候options.mounted 函数 this window call在对象里
		// 数据变了，怎么改HTML ? 单向数据绑定
		// 数据变了 搞定
		// html? 不会自己变
		// 找到node结点 h1 {{title}}
		// innerHTML = this.title
		// 页面上不止一个h1 所有{{title}}都要通知到
		// 结点在哪，当数据改变时，难点1： 数据一变，结点立马变 notice
		// 所有跟title有关的结点 数组[] 遍历结点时 编译模板 {{title}}替换抓结点的时机
		// 当从#app开始遍历 childnodes .push[] observer 监听一下这个title 订阅--发布者模式
		// title 发生改变的时候，所有订阅了的node 都遍历一遍 改变innerHTML 
		// 双向绑定肯定不会太难 input事件反向
		Object.keys(this.data).forEach(key => {
			// console.log(key)
			this.proxyKeys(key)
		})
		// 编译模板
		// 一 替换表达式 {{title}}
		// 二 指令的处理 v-model v-on:click
		// 三 添加订阅者
		new Compile(options.el, this)
		options.mounted.call(this)
	}
	proxyKeys (key) {
		var self = this
		Object.defineProperty(this, key, {
			enumerable: false,
			configurable: true,
			get: function getter() {
				return self.data[key]
			},
			set: function setter(newVal) {
				// this.title === this.data.title
				self.data[key] = newVal
			}
		})
	}
}