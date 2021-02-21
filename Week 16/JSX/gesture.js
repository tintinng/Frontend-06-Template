let element = document.documentElement
// listen => recognize => dispatch

export class Dispatcher {
    constructor(element) {
        this.element = element
    }
    // 派发事件
    dispatch(type, properties) {
        // 创建事件，传入事件类型
        let event = new Event(type)
        // console.log(event)
        // 给事件添加属性
        for (let name in properties) {
            event[name] = properties[name]
        }
        // 调用接口派发事件
        this.element.dispatchEvent(event)
    }
}
export class Listener {
    constructor(element, recognizer){
        let isListeningMouse = false

        let contexts = new Map()

        element.addEventListener("mousedown", event => {

            let context = Object.create(null)
            contexts.set("mouse" + (1 << event.button), context)

            // console.log(event)
            recognizer.start(event, context)

            let mousemove = event => {
                let button = 1
                // mousemove事件没有对应的event.button，需要从event.buttons（掩码形式）里面获取
                while (button <= event.buttons) {
                    if (button & event.buttons) {
                        // order of buttons & button property is not same
                        let key
                        if (button === 2) {
                            key = 4
                        } else if (button === 4) {
                            key = 2
                        } else {
                            key = button
                        }
                        let context = contexts.get("mouse" + key)
                        recognizer.move(event, context)
                    }
                    button = button << 1
                }
                // console.log(event.clientX, event.clientY)
            }
            let mouseup = event => {
                let context = contexts.get("mouse" + (1 << event.button))
                recognizer.end(event, context)
                contexts.delete("mouse" + (1 << event.button))

                if (event.buttons === 0) {
                    document.removeEventListener("mousemove", mousemove)
                    document.removeEventListener("mouseup", mouseup)
                    isListeningMouse = false
                }
            }
            if (!isListeningMouse) {
                document.addEventListener("mousemove", mousemove)
                document.addEventListener("mouseup", mouseup)
                isListeningMouse = true
            }
        })
        element.addEventListener("touchstart", event => {
            // event.changedTouches代表一个触摸平面上所有触点的列表
            // console.log(event.changedTouches)
            for (let touch of event.changedTouches) {
                // console.log(touch)
                let context = Object.create(null)
                contexts.set(touch.identifier, context)
                recognizer.start(touch, context)
            }
        })
        
        element.addEventListener("touchmove", event => {
            for (let touch of event.changedTouches) {
                let context = contexts.get(touch.identifier)
                recognizer.move(touch, context)
            }
        })
        
        element.addEventListener("touchend", event => {
            for (let touch of event.changedTouches) {
                let context = contexts.get(touch.identifier)
                recognizer.end(touch, context)
                contexts.delete(touch.identifier)
            }
        })
        
        // touch事件序列可能会被打断，end变成cancel
        element.addEventListener("touchcancel", event => {
            for (let touch of event.changedTouches) {
                let context = contexts.get(touch.identifier)
                recognizer.cancel(touch, context)
                contexts.delete(touch.identifier)
            }
        })
    }
}
export class Recognizer {
    constructor(dispatcher){
        this.dispatcher = dispatcher
    }
    // 将手势操作和鼠标移动统一抽象

    /**
     * 开始事件处理函数
     * 将鼠标的mousedown和移动端的touchstart抽象为start
     * @param {*} point 触碰的点；点击的点 
     * @param {*} context 
     */
    start (point, context) {
        context.startX = point.clientX, context.startY = point.clientY

        // 派发start事件和需要的属性
        this.dispatcher.dispatch("start", {
            clientX: point.clientX,
            clientY: point.clientY
        })

        context.points = [{
            t: Date.now(),
            x: point.clientX,
            y: point.clientY
        }]
        
        // 设置移动端的状态变量
        context.isTap = true
        context.isPan = false
        context.isPress = false
        // 如果0.5s内没有被move\end\cancel等操作取消该定时器，则会变成press事件
        context.handler = setTimeout(() => {
            context.isTap = false
            context.isPan = false
            context.isPress = true
            context.handler = null
            // console.log("press")
            // 派发press事件和需要的属性
            this.dispatcher.dispatch("press", {})
        }, 500);
    }
    /**
     * 移动事件处理函数
     * 将鼠标按下后的mousemove和移动端的pan抽象为move
     * @param {*} point 
     * @param {*} context 
     */
    move (point, context) {
        // 判断是否移动10px，手势的tap可能会存在部分位移，因此认为在10px以内就算是tap
        // 使用状态isPan
        let dx = point.clientX - context.startX, dy = point.clientY - context.startY
        if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
            context.isTap = false
            context.isPan = true
            context.isPress = false
            // 判断是不是水平move（轮播图水平滑动）
            context.isVertical = Math.abs(dx) < Math.abs(dy)
            this.dispatcher.dispatch("panstart", {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical
            })
            // 取消掉press事件的定时器
            clearTimeout(context.handler)
        }
        // 持续派发pan事件和需要的属性
        if (context.isPan) {
            this.dispatcher.dispatch("pan", {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical
            })
        }
        context.points = context.points.filter(point => Date.now() - point.t < 500)
        context.points.push({
            t: Date.now(),
            x: point.clientX,
            y: point.clientY
        })
        // console.log("move", point.clientX, point.clientY);
    }
    /**
     * 结束事件处理函数
     * 将鼠标的mouseup和移动端的panend\flick抽象为end
     * @param {*} point 
     * @param {*} context 
     */
    end (point, context) {
        if (context.isTap) {
            // console.log("tap");
            this.dispatcher.dispatch("tap", {})
            clearTimeout(context.handler)
        }
        
        if (context.isPress) {
            this.dispatcher.dispatch("pressend", {})
        }
        context.points = context.points.filter(point => Date.now() - point.t < 500)
        let d, v
        if (!context.points.length) {
            v = 0
        } else {
            d = Math.sqrt((point.clientX - context.points[0].x) ** 2 + 
                (point.clientY - context.points[0].y) ** 2)
            v = d / (Date.now() - context.points[0].t)
        }
        // 根据手势tap的move速度判断flick事件
        if (v > 1.5) {
            context.isFlick = true
            // 派发flick事件和需要的属性
            this.dispatcher.dispatch("flick", {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick,
                velocity: v
            })
        } else {
            context.isFlick = false
        }

        if (context.isPan) {
            // 派发panend事件和需要的属性
            this.dispatcher.dispatch("panend", {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick,
                velocity: v
            })
        }
    
        // console.log(v)
        // console.log("end", point.clientX, point.clientY);
        this.dispatcher.dispatch("end", {
            startX: context.startX,
            startY: context.startY,
            clientX: point.clientX,
            clientY: point.clientY,
            isVertical: context.isVertical,
            isFlick: context.isFlick,
            velocity: v
        })
    }
    cancel (point, context) {
        // console.log("cancel", point.clientX, point.clientY);
        clearTimeout(context.handler)
        this.dispatcher.dispatch("cancel", {})
    }
}

export function enableGesture(element) {
    // 给元素添加Listener
    new Listener(element, new Recognizer(new Dispatcher(element)))
}



