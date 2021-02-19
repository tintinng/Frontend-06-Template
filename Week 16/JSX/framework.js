// createElement的参数根据webpack配置的JSX的解析器转换结果来定义
export function createElement(type, attributes, ...children) {
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
    // 挂上子节点
    for (let child of children) {
        // 文本节点会变成字符串
        if (typeof child === "string") {
            child = new TextWrapper(child) 
        }
        element.appendChild(child)
    }

    // 返回创建的元素
    return element;
}

// 为了能像普通的element元素一样操作，需要实现以下的一些方法
// 如：setAttribute、appendChild
// this.root表示当前的element
export class Component {
    constructor(type) {
        // this.root = this.render()
    }
    setAttribute(name, value) {
        this.root.setAttribute(name, value)
    }
    appendChild(child) {
        child.mountTo(this.root)
    }
    // 反向操作，挂到父节点上
    mountTo(parent) {
        parent.appendChild(this.root)
    }
}

// 普通的element也封装起来，继承Component，从而可以使用mountTo函数
class ElementWrapper extends Component{
    constructor(type) {
        this.root = document.createElement(type)
    }
}
class TextWrapper extends Component{
    constructor(content) {
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