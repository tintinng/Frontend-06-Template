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
        // 对TimeLine进行状态管理，提高代码健壮性
        this.state = "inited"
        // TimeLine中存放一个animation的队列
        this[ANIMATIONS] = new Set()
        // 每一个animation都对应一个startTime，不一定得是在TimeLine启动的同时启动animation
        this[START_TIME] = new Map()
    }
    // 开始
    start() {
        if (this.state !== "inited") {
            return ;
        }
        this.state = "started"
        // TimeLine开始的时间
        let startTime = Date.now()
        // 暂停时长，初始化为0；动画resume的时候需要减掉暂停时长
        this[PAUSE_TIME] = 0
        // tick函数
        this[TICK] = () => {
            // 每次tick的时间
            let now = Date.now()
            // 遍历所有动画
            for (let animation of this[ANIMATIONS]) {
                let t
                // 动画的startTime小于TimeLine的startTime（动画在被add到TimeLine里面之前就已经启动了）
                if (this[START_TIME].get(animation) < startTime) {
                    t = now - startTime - this[PAUSE_TIME] - animation.delay
                } else {// 启动TimeLine之后再add animation
                    t = now - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay
                }
                // 动画结束：如果执行时间大于animation设定的duration，则将对应animation移掉
                if (animation.duration < t) {
                    this[ANIMATIONS].delete(animation)
                    t = animation.duration
                }
                // t是负数则说明动画还没开始，不需要执行
                if (t > 0) {
                    // 执行动画，传入一个执行时间
                    animation.receive(t)
                }
            }
            // 每秒60次的频率调用，与浏览器屏幕的刷新次数相匹配
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
        // 记录下暂停开始的时间
        this[PAUSE_START] = Date.now()
        // cancelAnimationFrame：取消一个先前通过调用requestAnimationFrame添加过的动画帧请求
        cancelAnimationFrame(this[TICK_HANDLE]);
    }
    // 恢复
    resume() {
        if (this.state !== "paused") {
            return ;
        }
        this.state = "started"
        // 暂停时长，恢复动画的时候需要减掉暂停时长
        this[PAUSE_TIME] += Date.now() - this[PAUSE_START]
        this[TICK]();
    }
    // 重启
    reset(){
        this.pause()
        // 重置状态
        this.state = "inited"
        let startTime = Date.now()
        this[PAUSE_TIME] = 0
        this[ANIMATIONS] = new Set()
        this[START_TIME] = new Map()
        this[PAUSE_START] = 0
        this[TICK_HANDLE] = null
    }
    // 添加动画
    add(animation, startTime) {
        // 如果添加动画的时候没有传入startTime参数，则给startTime一个默认值
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
    // (Object用于存放多个[属性-动画]声明,属性,起始值,终止值,持续时间,推迟时间,timingFunction,模板函数)
    constructor(object, property, startValue, endValue, duration, delay, timingFunction, template) {
        // 默认值
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
    // 执行函数，接受时间，动画动到对应的时间点上
    receive(time) {
        // console.log(time)
        // 变化区间
        let range = this.endValue - this.startValue
        // TimingFunction：横轴是0到1的time，纵轴是0到1的progression
        let progress = this.timingFunction(time / this.duration)
        this.object[this.property] = this.template(this.startValue + range * progress)
    }
}