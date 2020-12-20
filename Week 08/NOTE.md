学习笔记
### 使用状态机处理字符串
#### 有限状态机
- 每一个状态都是一个机器

在每一个状态中都可以计算、存储和输出，可以用函数来表示
- 每一个机器都有下一个确定的状态
- JS中的有限状态机（Mealy）
```javascript
// 状态机
function state(input) {
    // 处理一些计算
    // 转到下一个状态
    return next;
}

// 接收输入，使用状态机处理
while(input) {
    state = state(input);
}
```
### HTTP协议解析
#### 使用Node中的TCP层的工具包
```require('net')```
#### HTTP请求响应过程
- 构建请求：设置必要请求参数，包括请求方法、请求头的字段、请求IP、端口号和请求路径等。
- 发送请求：采用异步函数发送，使用TCP连接发送（Node中的net包）
- 处理响应：解析http响应，读取响应行、响应头的字段和响应体，并根据响应头中的```Content-Type```字段处理响应体。（暂时只处理了chunk类型）

### 完整流程绘图总结
[输入URL到页面展示](https://ding_zhi_chao.gitee.io/tintinblog/CSbase/browser/#%E6%B5%8F%E8%A7%88%E5%99%A8)