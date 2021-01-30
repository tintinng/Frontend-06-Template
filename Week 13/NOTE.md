学习笔记
## HTML
### XML和SGML
### HTML语义标签
### HTML语法
#### 合法元素
- Element: ```<tagname></tagname>```
- Text: ```text```
- Comment: ```<!-- coments -->```
- DocumentType: ```<!Doctype html>```
- ProcessingInstruction:```<?a 1?>```
- CDATA:```<![CDATA[]]>```
#### 字符引用
- '':```&#161;```
- '&':```&amp;```
- '<':```&lt;``` or ```&#60;```
- '"':```&quot;``` (双引号)
- no breaking space: ```&nbsp;``` (不间断空格)
## 浏览器API
### DOM API
#### Node导航类
- parentNode
- childNodes
- firstChild
- lastChild
- nextSibling
- previousSibling
#### Element导航类
- parentElement
- children
- firstElementChild
- lastElementChild
- nextElementSibling
- previousElementSibling
#### 修改操作
- appendChild
- insertBefore
- removeChild
- replaceChild
#### 高级操作
- compareDocumentPosition：用于比较两个节点的关系
- contains：检查一个节点是否包含另一个节点
- isEqualNode：检查两个节点是否完全相同（DOM树结构相同即可）
- isSameNode：检查两个节点是否是同一个节点（和js中的===相同）
- cloneNode：赋值一个节点，传入true会连同子元素实现深拷贝
### 事件 API
#### addEventListener
- type
- listener
- opstion
  - capture：false
  - once：false
  - passive：false
- usecaptrue
#### 冒泡和捕获
- 历史原因：微软提出冒泡模型，网景提出捕获模型。冒泡为主流浏览器兼容，因此现在大多默认在冒泡过程处理事件。
- 捕获：事件从根节点传到目标节点的过程
- 冒泡：事件从目标节点传到根节点的过程
### Range API
- HTML文档流里面有起始和终止的一段连续的范围
  - 有一个起点和一个终点
  - 起点只需要在终点的前面，不需要相同的层级关系
  - 起始点组成：```element + 偏移值```
    - element：偏移值为child
    - textNode：偏移值为文字的个数
#### range的创建
```javascript
// 脚本创建
var range = new Range()
range.setStart(element, 9)
range.setEnd(element, 4)
// 选中创建
var range = document.getSelection().getRangeAt(0)
```
- **比 DOM API 更精确、更高效的操作**
- DOM 是一个 living collection，结构会随着DOM的操作而变化
#### Range API
  - range.setStartBefore
  - range.setEndBefore
  - range.setStartAfter
  - range.setEndAfter
  - range.selectNode
  - range.selectNodeContents
  - range.extractContents 移除range
  - range.insertNode  插入range
### CSSOM
#### document.styleSheets
  - cssRules
  - insertRule
  - removeRule
#### window.getComputedStyle(elt, pseudoElt)
  - 无法通过DOM和cssRules获取的样式，可以用计算样式获取到，比如动画的中间状态
### CSSOM View
#### window
- **viewport的高和宽：window.innerHeight, window.innerWidth**
- window.outerHeight, window.outerWidth
- **DPR，物理像素和逻辑像素px的比值：window.devicePixelRatio**
- window.screen
  - window.screen.width
  - window.screen.height
  - window.screen.availWidth
  - window.screen.availHeight
#### scroll 
- window.scroll
  - scrollX
  - scrollY
  - scroll(x, y)
  - scrollBy(x, y)
- element.scroll
  - scrollTop
  - scrollLeft
  - scrollWidth
  - scrollHeight
  - scroll(x, y)
  - scrollBy(x, y)
  - scrollIntiView()
#### layout
- eleemnt.getClientRects()
- element.getBoundingClientRect()
### 其它 API
