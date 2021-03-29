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
        // 组件的attribute
        for (let record of this[ATTRIBUTE].src) {
            let child = document.createElement("div")
            // child.src = record
            child.style.backgroundImage = `url('${record.img}')`
            this.root.appendChild(child)
        }
        // 引入手势逻辑
        enableGesture(this.root)
        // 启动动画时间线
        let timeline = new Timeline()
        timeline.start()
        // 轮播图的定时器，在手势介入的时候暂停
        let handler = null

        // 获取每一张轮播图
        let children = this.root.children
        // 记录当前展示的轮播图的下标，组件的state
        this[STATE].position = 0;

        // 动画开始的时间和动画导致的位移
        let t = 0
        let ax = 0

        // 添加事件的监听
        this.root.addEventListener("start", event => {
            // 当开始拖动轮播图的时候，暂停动画时间线并清除定时器
            timeline.pause()
            clearInterval(handler)

            if (Date.now() - t < 500) {
                // 动画的时间进度
                let timeProgress = (Date.now() - t) / 500
                // 动画的位移进度（从-500到0）
                ax = ease(timeProgress) * 500 - 500
            } else {
                ax = 0
            }
        })
        
        this.root.addEventListener("tap", event => {
            // tap的时候触发click事件
            this.triggerEvent("click", {
                data: this[ATTRIBUTE].src[this[STATE].position],
                position: this[STATE].position
            })
        })

        this.root.addEventListener("pan", event => {
            // 计算拖拽位移的时候减掉动画产生的位移
            // 相当于实际手势拖动的位移 + “动画拖动的位移”
            // ax => (-500, 0) -ax => (500, 0) 动画往左边滑，相当于对于下一张来讲向右滑动了 -ax
            let x = event.clientX - event.startX - ax
            // ((x - x % 500) / 500)和Math.floor()对于负数的处理不一样
            // current表示拖动过程中当前展示的轮播图下标（注意并不一定是显示多的那一种轮播图，当前轮播图完全划过后current才是下一张，否则current是当前张）
            let current = this[STATE].position - ((x - x % 500) / 500)
            // 将当前和前后三张轮播图移动到正确位置（pan过程中的位置）
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
            // timeline.resume()
            handler = setInterval(nextPicture, 3000)

            let x = event.clientX - event.startX - ax
            let current = this[STATE].position - ((x - x % 500) / 500)
            console.log("x:" + x + "---ax:" + ax + "---current:" + current);

            // -1 \ 0 \ 1 end的时候应该回归的方向（-250到250为0）
            let direction = Math.round((x % 500) / 500)

            if (event.isFlick) {
                if (event.velocity < 0) {
                    direction = Math.ceil((x % 500) / 500)
                } else {
                    direction = Math.floor((x % 500) / 500)
                }
            }
            // 将当前和前后三张轮播图移动到正确位置
            for (let offset of [-1, 0, 1]) {
                let pos = current + offset
                pos = (pos % children.length + children.length) % children.length

                // children[pos].style.transition = "none"
                timeline.add(new Animation(children[pos].style, "transform",
                - pos * 500 + offset * 500 + x % 500,   // 起始位置：move过程中的位置
                - pos * 500 + offset * 500 + direction * 500,   // 结束位置：应该回归的位置 
                1500, 0, ease, v => `translateX(${v}px)`))
            }

            // 更新position
            this[STATE].position = this[STATE].position - ((x - x % 500) / 500) - direction
            this[STATE].position = (this[STATE].position % children.length + children.length) % children.length
            // 每切换一张轮播图触发一次change事件
            this.triggerEvent("change", { position: this[STATE].position })
        })

        // 下一张轮播图
        let nextPicture = () => {
            let children = this.root.children
            // 下一张轮播图的下标
            let nextIndex = (this[STATE].position + 1) % children.length
            // 当前轮播图和下一张轮播图
            let current = children[this[STATE].position]
            let next = children[nextIndex]
            
            // 动画开始的时间
            t = Date.now()
            // 当前轮播图移动的动画和下一张轮播图移动的动画
            // 动画设定为只有一个方向
            timeline.add(new Animation(current.style, "transform",
                - this[STATE].position * 500, -500 -this[STATE].position * 500, 500, 0, ease, v => `translateX(${v}px)`))
            timeline.add(new Animation(next.style, "transform",
                500 - nextIndex * 500, -nextIndex * 500, 500, 0, ease, v => `translateX(${v}px)`));

            this[STATE].position = nextIndex
            // 每切换一张轮播图触发一次change事件
            this.triggerEvent("change", { position: this[STATE].position })
        }

        // 3s切换一张轮播图
        handler = setInterval(nextPicture, 3000)

        return this.root
    }
}