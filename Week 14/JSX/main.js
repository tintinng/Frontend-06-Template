import { Component, createElement } from "./framework.js"

class Carousel extends Component{
    constructor() {
        super()
        this.attributes = Object.create(null)
    }
    setAttribute(name, value) {
        this.attributes[name] = value;
    }
    render() {
        // console.log(this.attributes.src)
        this.root = document.createElement("div")
        // 添加class
        this.root.classList.add('carousel')
        for (let record of this.attributes.src) {
            // 为什么不用img？img默认有一个拖拽的显示；改为使用div+背景图
            let child = document.createElement("div")
            // child.src = record
            child.style.backgroundImage = `url('${record}')`
            this.root.appendChild(child)
        }
        // 当前视图展示的图片下标
        let position = 0

        this.root.addEventListener("mousedown", event => {
            console.log(position)
            // console.log("mousedown")
            let children = this.root.children
            let startX = event.clientX

            let move = event => {
                // console.log("mousemove")
                // 鼠标偏移的距离
                let x = event.clientX - startX
                
                // 当前图片下标
                let current = position - ((x - x % 500) / 500)
                // console.log("current:"+current)
                // console.log(x)

                // move的过程中需要移动当前的和相邻的图片
                for (let offset of [-1, 0, 1]) {
                    let pos = current + offset
                    // 由于可能会向前拖动，因此要加上children.length再取余
                    // 这样只能往负方向拖动一圈
                    pos = (pos + children.length * 10) % children.length
                    console.log("pos:"+pos)
                    
                    // 图片移动的时候需要关掉transition
                    children[pos].style.transition = "none"
                    children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 + x % 500}px)`
                }
            }
            
            let up = event => {
                // console.log("mouseup")   
                // 鼠标up的x减去startX，往右拖拽时：x为负数
                let x = event.clientX - startX
                // round四舍五入，拖动超过一半则进一
                position = position - Math.round(x / 500)
                
                for (let offset of [0, - Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
                    let pos = position + offset
                    pos = (pos + children.length) % children.length

                    children[pos].style.transition = ""
                    children[pos].style.transform = `translateX(${- pos * 500 + offset * 500}px)`
                }
                document.removeEventListener("mousemove", move)
                document.removeEventListener("mouseup", up)
            }

            document.addEventListener("mousemove",move)
            document.addEventListener("mouseup", up)
        })
        
        // let currentIndex = 0
        // setInterval(() => {
        //     let children = this.root.children
        //     let nextIndex = (currentIndex + 1) % children.length

        //     let current = children[currentIndex]
        //     let next = children[nextIndex]

        //     // 提前把下一张轮播图移动到相邻的下一个位置
        //     // 由于只是提前移动，因此需要去掉过渡效果，否则影响整体的效果
        //     next.style.transition = "none"
        //     next.style.transform = `translateX(${100 - nextIndex * 100}%)`

        //     setTimeout(() => {
        //         // 恢复去掉的过渡效果
        //         next.style.transition = "ease 1s"
        //         // 当前视图图片移动；下一张图片移到当前视图
        //         current.style.transform = `translateX(${-100 - currentIndex * 100}%)`
        //         next.style.transform = `translateX(${- nextIndex * 100}%)`

        //         currentIndex = nextIndex
        //     }, 16)
        // }, 2000)

        return this.root
    }
    mountTo(parent){
        parent.appendChild(this.render())
    }
}

// let a = <Div id='a'>
//     <span>a</span>
//     <span>b</span>
//     <span>c</span>
// </Div>

// document.body.appendChild(a)
let d = [
    "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
    "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
    "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
    "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg"
]

let a = <Carousel src={d}/>
a.mountTo(document.body)
