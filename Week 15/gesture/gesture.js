let element = document.documentElement
// listen => recognize => dispatch

export class Dispatcher {
    constructor(element) {
        this.element = element
    }
    dispatch(type, properties) {
        // 创建Event派发事件
        let event = new Event(type)
        // console.log(event)
        // 给事件添加必要的属性
        for (let name in properties) {
            event[name] = properties[name]
        }
        // 向this.element派发event
        this.element.dispatchEvent(event)
    }
}
export class Listener {
    constructor(element, recognizer){
        // 防止多个键同时按下move导致 move和up事件被多次监听
        let isListeningMouse = false

        // 从触摸角度考虑：可能存在多个touch的情况
        // 从鼠标角度考虑：有左右键的区分
        // 因此对于任意"触点"的状态管理，都需要一个单独的context。
        //     鼠标key：mouse + (1 << event.button)
        //     触摸key：identifier
        let contexts = new Map()

        element.addEventListener("mousedown", event => {

            // key-value的使用，避免Object上原始的属性添乱
            let context = Object.create(null)
            // 根据不同的鼠标按键（1\2\3\4\5）设置对应的 context
            contexts.set("mouse" + (1 << event.button), context)

            // console.log(event)
            recognizer.start(event, context)

            let mousemove = event => {
                // mousemove事件没有对应的event.button，需要从event.buttons（掩码形式）里面获取
                // event.buttons表示move的时候有哪些键被按下来了
                let button = 1
                while (button <= event.buttons) {
                    // 判断button是否按下
                    if (button & event.buttons) {
                        // order of buttons & button property is not same
                        let key
                        // 调换中键和右键的顺序
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
                    // 遍历buttons
                    button = button << 1
                }
                // console.log(event.clientX, event.clientY)
            }
            let mouseup = event => {
                let context = contexts.get("mouse" + (1 << event.button))
                recognizer.end(event, context)
                contexts.delete("mouse" + (1 << event.button))

                // 如果所有按键都被释放，则remove监听事件
                if (event.buttons === 0) {
                    document.removeEventListener("mousemove", mousemove)
                    document.removeEventListener("mouseup", mouseup)
                    isListeningMouse = false
                }
            }
            // 只允许监听一次
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
                // 开始的时候为每一个 "触点" 添加一个context
                let context = Object.create(null)
                contexts.set(touch.identifier, context)
                recognizer.start(touch, context)
            }
        })
        
        element.addEventListener("touchmove", event => {
            for (let touch of event.changedTouches) {
                // move的时候取出对应 "触点" 的context
                let context = contexts.get(touch.identifier)
                recognizer.move(touch, context)
            }
        })
        
        element.addEventListener("touchend", event => {
            for (let touch of event.changedTouches) {
                let context = contexts.get(touch.identifier)
                recognizer.end(touch, context)
                // end的时候删除对应 "触点" 的context
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
    // let handler;
    // let startX, startY;
    // let isPan = false, isTap = true, isPress = false;
    // 将手势操作和鼠标移动统一抽象
    start (point, context) {
        // console.log(context)
        // console.log("start", point.clientX, point.clientY);
        context.startX = point.clientX, context.startY = point.clientY
        // 实现flick手势，在start的时候初始化points数组
        context.points = [{
            t: Date.now(),
            x: point.clientX,
            y: point.clientY
        }]
    
        context.isTap = true
        context.isPan = false
        context.isPress = false
    
        // 0.5s如果还未move或者end则产生 [press] 事件
        context.handler = setTimeout(() => {
            context.isTap = false
            context.isPan = false
            context.isPress = true
            context.handler = null
            // console.log("press")
            this.dispatcher.dispatch("press", {})
        }, 500);
    }
    move (point, context) {
        // 判断是否移动10px，如果超过10px则产生 [panstart] 事件
        let dx = point.clientX - context.startX, dy = point.clientY - context.startY
        // 可能会存在移动超过10px又移回来的情况。因此一旦超过10px就需要设置 isPan为true
        if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
            context.isTap = false
            context.isPan = true
            context.isPress = false
            context.isVertical = Math.abs(dx) < Math.abs(dy)
            this.dispatcher.dispatch("panstart", {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical
            })
            // 清除检查[press]的定时器
            clearTimeout(context.handler)
        }
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
        // console.log("move", point.clientX, point.clientY);
    }
    end (point, context) {
        if (context.isTap) {
            // console.log("tap");
            this.dispatcher.dispatch("tap", {})
            // 清除检查[press]的定时器
            clearTimeout(context.handler)
        }
        if (context.isPress) {
            this.dispatcher.dispatch("pressend", {})
        }

        context.points = context.points.filter(point => Date.now() - point.t < 500)
        // end的时候计算最近0.5s以内move过的点的速度
        let d, v
        if (!context.points.length) {
            v = 0
        } else {
            d = Math.sqrt((point.clientX - context.points[0].x) ** 2 + 
                (point.clientY - context.points[0].y) ** 2)
            v = d / (Date.now() - context.points[0].t)
        }
        // flick： px/ms
        if (v > 1.5) {
            context.isFlick = true
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
            this.dispatcher.dispatch("panend", {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick
            })
        }
    
        console.log(v)
        // console.log("end", point.clientX, point.clientY);
    }
    cancel (point, context) {
        // console.log("cancel", point.clientX, point.clientY);
        clearTimeout(context.handler)
        this.dispatcher.dispatch("cancel", {})
    }
}

export function enableGesture(element) {
    new Listener(element, new Recognizer(new Dispatcher(element)))
}



