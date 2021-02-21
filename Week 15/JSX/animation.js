// 使用Symbol把tick的操作藏起来，唯一独立的值
const TICK = Symbol("tick")
const TICK_HANDLE = Symbol("tick-handler")
const ANIMATIONS = Symbol("animations")
const START_TIME = Symbol("start-time")
const PAUSE_START = Symbol("pause-start")
const PAUSE_TIME = Symbol("pause-time")

// 将动画执行自身的TICK的过程包装成一个TimeLine
export class TimeLine {
    constructor() {
        this.state = "inited"
        // TimeLine中存放一个animation的队列
        this[ANIMATIONS] = new Set()
        this[START_TIME] = new Map()
    }
    // 开始
    start() {
        if (this.state !== "inited") {
            return ;
        }
        this.state = "started"
        // animation开始的时间
        let startTime = Date.now()
        this[PAUSE_TIME] = 0
        this[TICK] = () => {
            let now = Date.now()
            for (let animation of this[ANIMATIONS]) {
                let t
                if (this[START_TIME].get(animation) < startTime) {
                    t = now - startTime - this[PAUSE_TIME] - animation.delay
                } else {
                    t = now - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay
                }
                // 如果执行时间大于animation设定的duration，则将对应animation移掉
                if (animation.duration < t) {
                    this[ANIMATIONS].delete(animation)
                    t = animation.duration
                }
                if (t > 0) {
                    // 执行动画，传入一个执行时间
                    animation.receive(t)
                }
            }
            // 调用自身；返回的handler可以使用cancelAnimationFrame取消
            this[TICK_HANDLE] = requestAnimationFrame(this[TICK]);
        }
        // 启动TimeLine
        this[TICK]();
    }

    // set rate(){}
    // get rate(){}
    // 暂停
    pause() {
        if (this.state !== "started") {
            return ;
        }
        this.state = "paused"
        this[PAUSE_START] = Date.now()
        cancelAnimationFrame(this[TICK_HANDLE]);
    }
    // 恢复
    resume() {
        if (this.state !== "paused") {
            return ;
        }
        this.state = "started"
        this[PAUSE_TIME] += Date.now() - this[PAUSE_START]
        this[TICK]();
    }
    // 重启
    reset(){
        this.pause()
        this.state = "inited"
        let startTime = Date.now()
        this[PAUSE_TIME] = 0
        this[ANIMATIONS] = new Set()
        this[START_TIME] = new Map()
        this[PAUSE_START] = 0
        this[TICK_HANDLE] = null
    }

    add(animation, startTime) {
        if (arguments.length < 2) {
            startTime = Date.now()
        }
        // 添加animation（set数据结构）
        this[ANIMATIONS].add(animation)
        // 添加<animation, startTime>（map数据结构）
        this[START_TIME].set(animation, startTime)
    }
}

// 属性动画：css属性值的变化
// 帧动画：每秒多少张图片的变化
// 将动画封装起来
export class Animation {
    // (Object用于存放多个[属性-动画]声明,属性,起始值,终止值,持续时间,推迟时间,timingFunction,)
    constructor(object, property, startValue, endValue, duration, delay, timingFunction, template) {
        timingFunction = timingFunction || (v => v)
        template = template || (v => v)

        this.object = object;
        this.property = property;
        this.startValue = startValue;
        this.endValue = endValue;
        this.duration = duration;
        this.timingFunction = timingFunction;
        this.delay = delay;
        this.template = template;
    }
    // 接受虚拟时间
    receive(time) {
        // console.log(time)
        // 变化区间
        let range = this.endValue - this.startValue
        let progress = this.timingFunction(time / this.duration)
        this.object[this.property] = this.template(this.startValue + range * progress)
    }
}