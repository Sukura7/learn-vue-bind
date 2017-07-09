// 编译模板功能模块
class Compile {
	constructor(el, vm) {
		this.vm = vm 
		this.el = document.querySelector(el)
		this.fragment = null
		this.init()

	}
	init () {
		// 遍历结点
		if (this.el) {
			// 文档编译的过程伴随着虚拟DOM的过程
			// 原生的DOM 太耗性能，只改变一个title 将所有的html都改变
			// 那么也太浪费哦
			// 虚拟DOM 修改DOM 你改的是假的
			// title与title有关的代码 片段innerHTML 改变一下 代价更小
			// 重绘 重排 性能巨大
			// 如果对VM 有title name 等多处改变
			// 每次改变都立马更新结点，太频繁 太消耗性能
			// 使用虚拟DOM将这些改变全部收到，使用最后一次性更新真正的DOM
			this.fragment = this.nodeToFragment(this.el)
			// 改造的机会
			// 调用之前fragment 在内存里
			this.compileElement(this.fragment)
			this.el.appendChild(this.fragment)

			// 调用之后fragment 在页面上 fragment 功成身退

		}
	}
	compileElement (el) {
		let childNodes = el.childNodes

		// console.log(childNodes)
		// 1. 结点里有没有指令？ attributes -> 属性
		// 2. 结点里面是否有表达式 innerHtml -> 数据
		Array.from(childNodes).forEach(node => {
			let text = node.textContent
			let reg = /\{\{(.*)\}\}/
			if (this.isElementNode(node)) {
				// 是标签
				// console.log(node)
				this.compile(node);
				if(node.childNodes.length > 0) {
					this.compileElement(node)
				}
			}else if (this.isTextNode(node) && reg.test(text)){
				// 是文本结点{{}}
				// 得到了表达式文本结点，替换的
				// title {{title}} 文本结点
				// name {{name}} 
				// console.log(text)
				// alert(reg.exec(text)[1])
				// {{title}} 文本结点全面替换掉 相应的data数据值显示出来
				this.compileText(node, reg.exec(text)[1])

			}
		})
	}
	compileText (node, exp) {
		// 把文本结点的内容换掉
		// exp 值是多少
		let initText = this.vm.data[exp]
		this.updateText(node, initText)
		// 订阅数据绑定
		// 订阅过程 函数 是在何时执行
		// 在发布者 this.vm.data exp改变的时候 回调这个函数
		new Watcher(this.vm, exp, (val) => {
			// 闭包 node
			this.updateText(node, val)
		})
	}
	updateText (node, value) {
		node.textContent = value
	}
	compile (node) {
		let nodeAttrs = node.attributes;
		Array.from(nodeAttrs).forEach(attr => {
			// console.log(attr.name,attr.value)
			// v-model
			// v-on:click
			let attrName = attr.name
			let exp = attr.value
			let dir = attrName.substring(2)
			console.log(exp)

			if (this.isEventDirective(dir)) {
				// 是否是事件指令
				this.compileEvent(node, this.vm, exp, dir)
			}else if (this.isModelDirective(dir)) {
				// 是否是绑定指令
				this.compileModel(node, this.vm, exp, dir)
			}
		})
	}
	compileEvent (node, vm, exp, dir) {
		// dir: on:click
		// v-on:click = "clickMe"
		let eventType = dir.split(':')[1];
		let cb = vm.methods && vm.methods[exp]
		node.addEventListener(eventType, cb.bind(vm), false)
	}
	compileModel (node,vm,exp,dir) {
		let val = this.vm.data[exp]
		this.modalUpdater(node, val)
		node.addEventListener('input', (e) => {
			let newValue = e.target.value;
			if (val === newValue) {
				return;
			}
			this.vm[exp] = newValue
			val = newValue
		})
	}
	modalUpdater (node, val) {

		node.value = typeof type === undefined ? '':val
	}
	isEventDirective (dir) {
		return dir.indexOf('on:') === 0
	}
	isModelDirective (dir) {
		return dir === 'model'
	}
	isElementNode (node) {
		return node.nodeType === 1
	}
	isTextNode (node) {	
		return node.nodeType === 3
	}
 	nodeToFragment (el) {
		// 文档碎片 解决性能问题 并不是真正的结点
		// 可以把所有的结点都交给它 最后交给#app
		let fragment = document.createDocumentFragment()
		let child = el.firstChild
		// console.log(child)
		while (child) {
			fragment.appendChild(child)
			child = el.firstChild
		}
		return fragment
		// 所有的结点将离开真实DOM
		// 结点将获得重生
	}
}
