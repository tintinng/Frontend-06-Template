学习笔记
### At-rules
- @charset
- @import：用于引入css文件
- @media：对设备类型进行判断
- @page：用于分页媒体的表现设置
- @counter-style：定义列表项的表现
- @keyframes：用于定义动画关键帧
- @fontface：用于定义一种字体
- @support
- @namespace
- @viewport

### css规则
#### 选择器 Selector 
- Level-3
- Level-4
#### 声明 declaration
- key
   -  Properties 
   -  Varaiables：使用‘--’双减号声明，然后可以在子元素里面使用。例如：
```css
:root {
  --main-color: #06c;
  --accent-color: #006;
}
/* The rest of the CSS file */
#foo h1 {
  color: var(--main-color);
}
```
- value
    - 整形、百分比、浮点型等等、
    - calc()函数
    - 可以带px、em等单位