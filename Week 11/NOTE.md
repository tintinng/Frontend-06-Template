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
- 简单选择器
```
* | tag | .cls | #id | [attr=value] | :hover | ::before
```
- 复合选择器
```
// 与的关系
<简单选择器><简单选择器><简单选择器>
*或者div必须写在最前面；伪类、伪元素必须写在最后面
```
- 复杂选择器
```
后代选择器：<复合选择器><sp><复合选择器>
子代选择器：<复合选择器>">"<复合选择器>
后继选择器：<复合选择器>"~"<复合选择器>
直接后继选择器：<复合选择器>"+"<复合选择器>
table中选中某一个列：<复合选择器>"||"<复合选择器>
```
- 选择器列表：复杂选择器通过","组成
- 选择器优先级
```css
// [行内样式, id, 类/伪类/属性, 标签/伪元素]
// 大部分浏览器 N 取 65536
#id div.a#id {
  // ...
}
sp = [0, 2, 1, 1]
   = 0*(N^3) + 2*(N^2) + 1*(N^1) + 1
```
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
#### 伪类
- 链接/行为
```css
:any-link // 匹配所有的超链接
:link // 匹配还没有访问过的超链接
:visited  // 匹配访问过的超链接
:hover  // 
:active // 
:focus  //
:target //  当前hash指向当前a标签，则会激活target伪类
```
- 树结构
```css
:empty  //  表示当前元素是否有子元素
:nth-child()  // even、odd、3N+1，表示当前元素是父元素的第几个child
:nth-last-child() //  从后往前数
:first-child
:last-child
:only-child
```
- 逻辑型
```css
:not
:where
:has
```
#### 伪元素
```css
// 无中生有
// 加入before和after可以添加content属性，可以和真正的DOM元素一样生成盒参与后续的排版和渲染
::before
::after

// 选中元素特定内容
::first-line
::first-letter
```