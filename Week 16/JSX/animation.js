// 使用Symbol把tick的操作藏起来，唯一独立的值
const TICK = Symbol("tick") // 表示一次页面的刷新
const TICK_HANDLE = Symbol("tick-handler")  // requestAnimationFrame的返回值
const ANIMATIONS = Symbol("animations")
const START_TIME = Symbol("start-time")
const PAUSE_START = Symbol("pause-start") // 暂停开始时间
const PAUSE_TIME = Symbol("pause-time") // 暂停时长

export class Timeline {
    constructor() {
        this.state = "inited"
        // 用于存放时间线上的所有animation
        this[ANIMATIONS] = new Set()
        // 存储每一个animation的开始时间
        this[START_TIME] = new Map()
    }
    start() {   // 启动时间线
        if (this.state !== "inited") {
            return ;
        }
        this.state = "started"
        let startTime = Date.now()  // 时间线启动时间
        this[PAUSE_TIME] = 0
        // tick函数：表示一次页面的刷新
        this[TICK] = () => {
            let now = Date.now()    // 每一次tick刷新帧的时间
            for (let animation of this[ANIMATIONS]) {   // 遍历所有的动画
                let t;  // 动画的执行时长t，用于确定动画的当前状态
                if (this[START_TIME].get(animation) < startTime) {
                    // 如果开始时间在TimeLine启动之前，则将TimeLine的启动时间作为开始时间
                    t = now - startTime - this[PAUSE_TIME] - animation.delay
                } else {
                    // 动画的执行时长t =（当前时间 - 动画开始时间 - 延迟时长 - 暂停时长）
                    t = now - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay
                }
                if (animation.duration < t) {   // 动画执行结束
                    this[ANIMATIONS].delete(animation)
                    t = animation.duration
                }
                if (t > 0) {    // 刷新动画状态
                    animation.receive(t)
                }
            }
            this[TICK_HANDLE] = requestAnimationFrame(this[TICK]);  // RAF回调
        }
        this[TICK]();
    }
    // set rate(){}
    // get rate(){}
    pause() {
        if (this.state !== "started") {
            return ;
        }
        this.state = "paused"
        this[PAUSE_START] = Date.now()
        cancelAnimationFrame(this[TICK_HANDLE]);    // 取消RAF回调，取消tick
    }
    resume() {
        if (this.state !== "paused") {
            return ;
        }
        this.state = "started"
        this[PAUSE_TIME] += Date.now() - this[PAUSE_START]  // 暂停时长 = 当前时间 - 暂停开始时间
        this[TICK]();   // 继续执行tick
    }

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

    add(animation, startTime) { // 添加动画
        if (arguments.length < 2) {
            startTime = Date.now()
        }
        this[ANIMATIONS].add(animation)
        this[START_TIME].set(animation, startTime)
    }
}

export class Animation {
    // 样式对象、属性、开始值、结束值、持续时长、延迟时长、timingFuction、template
    constructor(object, property, startValue, endValue, duration, delay, timingFunction, template) {
        timingFunction = timingFunction || (v => v) // Linear
        template = template || (v => v) // 单个属性值变化

        this.object = object;
        this.property = property;
        this.startValue = startValue;
        this.endValue = endValue;
        this.duration = duration;
        this.timingFunction = timingFunction;
        this.delay = delay;
        this.template = template;
    }
    receive(time) {
        // 时间范围
        let range = this.endValue - this.startValue
        // TimingFunction：横轴是0到1的time，纵轴是0到1的progression
        let progress = this.timingFunction(time / this.duration)
        this.object[this.property] = this.template(this.startValue + range * progress)
    }
}