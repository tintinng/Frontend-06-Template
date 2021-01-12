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
  - 给float换行
### BFC
  - 同一个BFC中相邻元素的margin-top盒margin-bottom会重叠