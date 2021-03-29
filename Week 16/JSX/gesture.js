let element = document.documentElement
// listen => recognize => dispatch
export class Listener {
    constructor(element, recognizer){
        // 防止多个键同时按下移动导致move和up事件被多次监听
        let isListeningMouse = false
        // 保存每一个 "点" 的context，在mousedown\touchstart的时候add
        let contexts = new Map()

        element.addEventListener("mousedown", event => {

            let context = Object.create(null)
            contexts.set("mouse" + (1 << event.button), context)

            // console.log(event)
            recognizer.start(event, context)

            let mousemove = event => {
                let button = 1
                // mousemove的时候是不区分鼠标按键的
                // mousemove事件没有对应的event.button，需要从event.buttons（掩码形式）里面获取
                // event.buttons表示move的
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

                if (event.buttons === 0) {// 只有在所有按键都被释放的情况下，才removeEventListener
                    document.removeEventListener("mousemove", mousemove)
                    document.removeEventListener("mouseup", mouseup)
                    isListeningMouse = false
                }
            }
            if (!isListeningMouse) {// 只有在没有监听事件时才addEventListener
                document.addEventListener("mousemove", mousemove)
                document.addEventListener("mouseup", mouseup)
                isListeningMouse = true
            }
        })
        element.addEventListener("touchstart", event => {
            // changedTouches在touchstart事件中表现为新增加的触点
            // touch对象表示在触控设备上的触摸点
            // console.log(event.changedTouches)
            for (let touch of event.changedTouches) {
                // 给touch对象设置一个context用于保存对应的状态，并保存在contexts中
                let context = Object.create(null)
                contexts.set(touch.identifier, context)
                recognizer.start(touch, context)
            }
        })
        // touchmove事件一定是发生在touchstart事件之后，不能跃过touchstart事件
        element.addEventListener("touchmove", event => {
            // changedTouches在touchmove事件中：和上一次事件相比较，发生了变化的触点
            for (let touch of event.changedTouches) {
                let context = contexts.get(touch.identifier)
                recognizer.move(touch, context)
            }
        })
        element.addEventListener("touchend", event => {
            // changedTouches在touchend事件中：已经从触摸面离开的触点的集合
            for (let touch of event.changedTouches) {
                let context = contexts.get(touch.identifier)
                recognizer.end(touch, context)
                contexts.delete(touch.identifier)   // 点 end之后删除掉对应的context
            }
        })
        // touch事件序列可能会被打断（alert），end变成cancel
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
        // 实现flick手势，在start的时候初始化points数组
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
            this.dispatcher.dispatch("press", {})// 派发press手势事件
        }, 500);
    }
    /**
     * 移动事件处理函数
     * 将鼠标按下后的mousemove和移动端的pan抽象为move
     * @param {*} point 鼠标或手指move过程中指向的点
     * @param {*} context 
     */
    move (point, context) {
        // 判断是否移动10px，手势的tap可能会存在部分位移，因此认为在10px以内就算是tap
        let dx = point.clientX - context.startX, dy = point.clientY - context.startY
        // 可能会存在移动超过10px又移回来的情况。因此一旦超过10px就需要设置 isPan为true
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
        // 对瞬时的move过程中的点过滤
        // 只保留 0.5s 以内的move过的点
        context.points = context.points.filter(point => Date.now() - point.t < 500)
        context.points.push({
            t: Date.now(),
            x: point.clientX,
            y: point.clientY
        })
    }
    /**
     * 结束事件处理函数
     * 将鼠标的mouseup和移动端的panend\flick抽象为end
     * @param {*} point 
     * @param {*} context 
     */
    end (point, context) {
        // end的时候判断isTap、isPress状态来派发事件
        if (context.isTap) {
            this.dispatcher.dispatch("tap", {})
            clearTimeout(context.handler)   // 清理定时器
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

export function enableGesture(element) {
    // 给元素添加Listener
    new Listener(element, new Recognizer(new Dispatcher(element)))
}



