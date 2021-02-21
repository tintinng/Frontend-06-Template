import { Component, STATE, ATTRIBUTE } from "./framework.js"
import { enableGesture } from "./gesture.js"
import { Timeline, Animation } from "./animation.js"
import { ease } from "./ease.js"

export { STATE, ATTRIBUTE } from "./framework.js" 

export class Carousel extends Component{
    constructor() {
        super()
    }
    render() {
        this.root = document.createElement("div")
        // 添加样式
        this.root.classList.add('carousel')
        // 给每一张轮播图都添加一个div，并将轮播图作为背景图片
        for (let record of this[ATTRIBUTE].src) {
            let child = document.createElement("div")
            // child.src = record
            child.style.backgroundImage = `url('${record.img}')`
            this.root.appendChild(child)
        }

        enableGesture(this.root)
        let timeline = new Timeline
        timeline.start()

        let handler = null

        let children = this.root.children
        // let position = 0  
        // 将position改造到state上
        this[STATE].position = 0;

        let t = 0
        let ax = 0

        this.root.addEventListener("start", event => {
            // 暂停动画时间线
            timeline.pause()
            clearInterval(handler)

            if (Date.now() - t < 1500) {
                let progress = (Date.now() - t) / 1500
                ax = ease(progress) * 500 - 500
            } else {
                ax = 0
            }
        })
        
        this.root.addEventListener("tap", event => {
            this.triggerEvent("click", {
                data: this[ATTRIBUTE].src[this[STATE].position],
                position: this[STATE].position
            })
        })

        this.root.addEventListener("pan", event => {
            let x = event.clientX - event.startX - ax
            let current = this[STATE].position - ((x - x % 500) / 500)
            for (let offset of [-1, 0, 1]) {
                let pos = current + offset
                pos = (pos % children.length + children.length) % children.length

                children[pos].style.transition = "none"
                children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 + x % 500}px)`
            }
            // console.log(x)
        })

        this.root.addEventListener("end", event => {
            // 重启动画时间线
            timeline.reset()
            timeline.start()
            handler = setInterval(nextPicture, 3000)

            let x = event.clientX - event.startX - ax
            let current = this[STATE].position - ((x - x % 500) / 500)

            // -1 \ 0 \ 1
            let direction = Math.round((x % 500) / 500)

            if (event.isFlick) {
                if (event.velocity < 0) {
                    direction = Math.ceil((x % 500) / 500)
                } else {
                    direction = Math.floor((x % 500) / 500)
                }
            }

            for (let offset of [-1, 0, 1]) {
                let pos = current + offset
                pos = (pos % children.length + children.length) % children.length

                children[pos].style.transition = "none"
                // children[pos].style.transform = `translateX(${}px)`
                timeline.add(new Animation(children[pos].style, "transform",
                - pos * 500 + offset * 500 + x % 500, 
                - pos * 500 + offset * 500 + direction * 500, 
                1500, 0, ease, v => `translateX(${v}px)`))
            }

            this[STATE].position = this[STATE].position - ((x - x % 500) / 500) - direction
            this[STATE].position = (this[STATE].position % children.length + children.length) % children.length
            // 触发change事件
            this.triggerEvent("change", { position: this[STATE].position })
        })

        let nextPicture = () => {
            let children = this.root.children
            let nextIndex = (this[STATE].position + 1) % children.length

            let current = children[this[STATE].position]
            let next = children[nextIndex]

            t = Date.now()

            // next.style.transition = "none"
            // next.style.transform = `translateX(${500 - nextIndex * 500}px)`

            timeline.add(new Animation(current.style, "transform",
                - this[STATE].position * 500, -500 -this[STATE].position * 500, 500, 0, ease, v => `translateX(${v}px)`))
            timeline.add(new Animation(next.style, "transform",
                500 - nextIndex * 500, -nextIndex * 500, 500, 0, ease, v => `translateX(${v}px)`));

            this[STATE].position = nextIndex
            // 触发change事件
            this.triggerEvent("change", { position: this[STATE].position })
        }

        handler = setInterval(nextPicture, 3000)

        /* 
        this.root.addEventListener("mousedown", event => {
            // console.log("mousedown")
            let children = this.root.children
            let startX = event.clientX

            let move = event => {
                // console.log("mousemove")
                let x = event.clientX - startX

                let current = position - ((x - x % 500) / 500)

                for (let offset of [-1, 0, 1]) {
                    let pos = current + offset
                    pos = (pos + children.length) % children.length

                    children[pos].style.transition = "none"
                    children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 + x % 500}px)`
                }
            }
            
            let up = event => {
                // console.log("mouseup")   
                let x = event.clientX - startX
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
        */

        // let currentIndex = 0

        return this.root
    }
}