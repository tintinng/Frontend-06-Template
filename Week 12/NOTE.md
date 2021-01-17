学习笔记
## CSS排版
### 标签、元素、盒
```
HTML代码中可以书写开始标签，结束标签，和自封闭标签。
一对起止标签表示一个元素。
DOM树中存储的是元素和其它类型的节点（Node）
CSS选择器选中的是元素。
CSS选择器选中的元素，在排版时可能产生多个盒。
排版和渲染的基本单位是盒。
```
### 盒模型
#### **盒模型是进行排版和渲染的基本单位**
- margin：用于分隔相邻元素
- border：
- padding：用于内容区域的边界留白
- content：实际内容
#### 盒模型的width会被box-sizing影响
- content-box：width = 内容的宽度
- border-box：width = 内容的宽度 + padding + border

### 正常流
#### 正常流排版
- 收集盒进行
- 计算盒在行中的排布
- 计算行的排布
#### 正常流的行级排布
- line-top盒line-bottom的位置会被行内盒的位置、尺寸影响。text的text-top、text-bottom、middle盒baseline不会被影响
#### 正常流的块级排布
- float
  - float已经脱离了正常流，但是依附于原来的正常流，并且影响原来的正常流
- clear
  - 在left\right\both找一块干净的区域排布
  - 可用于给float换行
### BFC
#### 相关术语
  - **Block Container**:里面有BFC的，里面能容纳正常流的盒
```css
block | inline-block | table-cell | flex item | grid cell | table-caption
```
  - **Block-level Box**:外面有BFC的
```css
/* block level */
display:block|flex|table|grid 
/* inline level */
display:inline-block|inline-flex|inline-table|inline-grid
```
  - **Block Box**:里外都有BFC
#### 设立BFC
  - float
  - absolutely positioned elements
  - block containers(只是block container但是不是block box)
  - overflow不是visible的
#### BFC合并
  - 浮动定位和清除浮动都只会针对同一个BFC内的元素
  - 外边距折叠（margin-top盒margin-bottom）也只会发生在属于同一BFC的块级元素之间
### flex排版
#### 排版原则
- 收集盒进行
- 计算盒在主轴方向的排布
- 计算盒在交叉轴方向的排布
#### 分行
- 根据主轴尺寸，把元素分进行
- 若设置了no-wrap，则强行分配进第一行
#### 计算主轴方向
- 找出所有Flex元素
- 把主轴方向的剩余尺寸按比例分配给这些元素
- 若剩余空间为负数，所有Flex元素为0，等比例压缩剩余元素
#### 计算交叉轴方向
- 根据每一行中最大元素尺寸计算行高
- 根据行高flex-align和item-align，确定元素具体位置

## 动画与绘制
### 动画
#### @keyframes定义关键帧
```css
@keyframes mykf {
  from {background: red;}
  to {background: yellow;}
}
```
```css
@keyframes mykf {
  0% {top:0;transition: top ease;}
  50% {top:30px;transition: top ease-in;}
  75% {top:10px;transition: top ease-out;}
  100% {top:0;transition: top linear;}
}
```
#### animation使用
```css
div {
  animation: mykf 5s infinite;
}
```
- animation-name: 时间曲线
- animation-duration: 动画的时长
- animation-timing-function：动画的时间曲线
- animation-delay：动画开始前的延迟
- animation-iteration-count：动画的播放次数
- animation-direction：动画的方向
#### transition
- transition-property：要变换的属性
- transition-duration：变换的时长
- transition-timing-function：时间曲线
- transition-delay：延迟
#### cubic-bezier
- 贝塞尔曲线具有强大的拟合能力
- 使用三次贝塞尔曲线拟合抛物线可以应用到许多实际场景
  - iphone的下滑scroll
  - 弹簧的回弹等
### 颜色
#### CMYK和RGB
#### HSL和HSV
- W3C采用HSL（Hue、Saturation、Lightness）
### 绘制
#### 几何图形
- border
- box-shadow
- border-radius
#### 文字
- font
- text-decoration
#### 位图
- background-image
#### 适用技巧
- 使用data uri + svg去描绘图片