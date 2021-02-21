// createElement的参数根据webpack配置的JSX的解析器转换结果来定义
export function createElement(type, attributes, ...children) {
    console.log("type: " + type);
    // 创建元素
    let element;
    // 小写的JSX为被转换为string，表示原生的元素
    if (typeof type === 'string') {
        element = new ElementWrapper(type);
    } else {// 大写的JSX表示一个类，需要自行创建实例
        element = new type();
    }

    // 挂上属性
    for (let name in attributes) {
        element.setAttribute(name, attributes[name])
    }

    // 处理子节点
    let processChildren = (children) => {
        for (let child of children) {
            // 处理数组,递归调用processChildren
            if (Array.isArray(child)) {
                processChildren(child)
                continue;
            }
            // 文本节点会变成字符串
            if (typeof child === "string") {
                child = new TextWrapper(child) 
            }
            console.log(child)
            element.appendChild(child)
        }
    }
    processChildren(children)

    // 返回创建的元素
    return element;
}

export const STATE = Symbol("state")
export const ATTRIBUTE = Symbol("attribute")

// 为了能像普通的element元素一样操作，需要实现以下的一些方法
// 如：setAttribute、appendChild
// this.root表示当前的element
export class Component {
    constructor(type) {
        this[ATTRIBUTE] = Object.create(null)
        this[STATE] = Object.create(null)
    }
    render() {
        return this.root
    }
    setAttribute(name, value) {
        this[ATTRIBUTE][name] = value
    }
    appendChild(child) {
        child.mountTo(this.root)
    }
    // 反向操作，挂到父节点上
    mountTo(parent) {
        if (!this.root) {
            this.render()
        }
        parent.appendChild(this.root)
    }
    triggerEvent(type, args) {
        // 使用浏览器的CustomEvent
        this[ATTRIBUTE]["on" + type.replace(/^[\s\S]/, s => s.toUpperCase())](new CustomEvent(type, { detail: args }))
    }
}

// 普通的element也封装起来，继承Component，从而可以使用mountTo函数
class ElementWrapper extends Component{
    constructor(type) {
        super()
        this.root = document.createElement(type)
    }
    setAttribute(name, value) {
        this.root.setAttribute(name, value)
    }
}
class TextWrapper extends Component{
    constructor(content) {
        super()
        this.root = document.createTextNode(content)
    }
}

// class Div {
//     constructor() {
//         this.root = document.createElement("div")
//     }
//     setAttribute(name, value) {
//         this.root.setAttribute(name, value)
//     }
//     appendChild(child) {
//         child.mountTo(this.root)
//     }
//     mountTo(parent) {
//         parent.appendChild(this.root)
//     }
// }