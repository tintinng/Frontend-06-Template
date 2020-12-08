学习笔记
 ## 编程语言
 ### 编程语言的分类
 #### 按照用途分类
 - 数据描述语言：```JSON、HTML、CSS、SQL等```
 - 编程语言：```C、C++、Java、C#、python、JavaScript等```
 #### 按照表达方式
 - 声明式语言：只告诉结果。```JSON、HTML、CSS、SQL等```
 - 命令式语言：需要达成结果的步骤。```C、C++、Java、C#、python、JavaScript等```
### 编程语言的性质
#### 运行时runtime和编译时compiletime
- 运行时指在程序实际运行过程中，正式的产品，跑在服务器上
- 编译时指在程序员编写代码的过程中
#### 静态类型系统和动态类型系统
- 动态类型：能在用户的内存中找到对应的类型。```JavaScript （可以在runtime获取对应变量的类型）```
- 静态类型：只在编写代码的时候才有类型信息。```C++ (编译完成跑起来的时候丢掉了类型信息)```

Java可以通过反射获取类型信息，通常被认为是半动态、半静态类型。
#### 强类型和弱类型
- 强类型：类型转换不会默认发生
- 弱类型：并未使用严格的数据类型，会发生自动类型转换。```如：JavaScript```
## JavaScript数据类型
### Number
- IEEE 754格式，既表示整数也表示浮点数
```javascript
let intNum = 55;    // 整数
let biNum = 0b111;  // 二进制整数 
let octalNum = 0o70; // 八进制整数 或者070
let hexNum = 0xA;   // 十六进制整数
let floatNum = 0.1; // 小数
let floatNum = 10.0;    // 当成整数10处理
let floatNum = 1.;  // 当成整数1处理
// 1.toString()会出错，需要加一个空格
1 .toString();
```
- 对于太大或者太小的数可以用科学计数法表示
```javascript
let floatNum = 3.125e7; // 等于31250000
let floatNum2 = 3e-17; // 等于0.000 000 000 000 000 03
```
- 值的范围
  - （2^-1075, 2^1024）即： Number.MIN_VALUE ~ Number.MAX_VALUE
  - 超过这个范围则会返回 0或Infinity
- 值的精度
  - 整数有效精度：(-2^53, 2^53)。15位即以内的整数都精确
  - **浮点数存储的时候精度就已经丢失了**，0.1：```0 01111111011 1001100110011001100110011001100110011001100110011010```。小数部分（有效数字）无法精确表示。
  - **由于精度问题，永远不要测试某个特定的浮点值**
```javascript
0.1 + 0.2 == 0.3 // false
```
- NaN (Not a Number)
  - 用于本来要返回数值的操作失败了,如：``` 0/0、Number(undefined)、parseInt('abc') ```
  - 不等于任何值（包括NaN本身）
  - 布尔运算时为 false
- 数值转换
  - Number()转型函数，```‘+’也是数值转换，和Number()遵循相同的转换规则。注意：Number(null) == 0,Number(undefined)==NaN```
  - parseInt()和parseFloat()更专注于将字符串转换为数字
  
### String类型
- 表示0或多个16位的Unicode字符序列，可用双引号、单引号和反引号表示
- 不可变
- 字符串转换
  - toString()：null和undefined没有此方法。数字字面量需要在前面加入空格：```1 .toString() == '1'```
  - String()转型函数:如果有toString()方法则调用该方法，否则:```String(null) === "null"、String(undefined) === "undefined"```
- 模板字面量：保留换行符，可跨行定义字符串
- 使用${}字符串插值，可以在插值表达式种调用函数
- 使用String.raw获取原始的模板字面量，而不是转义后的内容
```javascript
`\u00A9`    // ©
String.raw`\u00A9`  //  `\u00A9`
```
### Boolean类型
- true 和 false 两个字面量（非首字母大写、非1和0）
- 布尔值转换表：

    | 数据类型  |    true    |   false    |
    | :-------: | :--------: | :--------: |
    |  Number   |  非零数值  |   0、NaN   |
    |  String   | 非空字符串 | 空字符串"" |
    |  Object   |  非空对象  |    null    |
    | Undefined |     无     | undefined  |

### Undefined
- 只有一个值 undefined
- 可以通过 ```void(0)```产生（void一切都可以）
- 这个数据类型是为了区分空指针和未初始化变量的区别
- 任何未经初始化的变量都会被赋予undefined值
- 由于 typeof 一个未声明的变量结果也是 undefined，因此建议在声明变量时进行初始化用于区分未声明的变量
  
### Null
- 只有一个值 null
- 表示一个空指针对象，```typeof null === 'object'```
- 对于要将来要保存对象值的变量，建议使用null来初始化
### Symbol
- 代替String用于Object中的属性名
## 对象Object
### 对象三要素
- 状态
- 行为：**遵循“行为改变状态”的规则**
- 唯一标识
### 对象的属性
- JavaScript中的属性既可以描述状态又可以描述行为
#### 键（key）
- String：使用者可以“猜出来”
- Symbol：独一无二，即使是名字相同的两个Symbol也是不同的
#### 值（value）
- 数据属性（Data Property)特性
```
- [[Configurable]]：可否delete属性；可否修改特性；可否改为访问器属性。
- [[Enumerable]]：属性可否通过for-in循环返回
- [[Writable]]：属性值是否可修改
- [[value]]：包含实际的值
```
- 访问器属性（Accessor Property）特性
```
访问器属性,通过Object.defineProperty()定义
访问器属性可以设置函数钩子，在[[Get]]、[[Set]]的时候可以添加相应钩子操作

- [[Configurable]]：可否delete属性；可否修改特性；可否改为数据属性
- [[Enumerable]]：属性可否通过for-in循环返回
- [[Get]]：获取函数
- [[Set]]：设置函数
```
### 对象标识
由于对象是引用类型，对象的引用值实际上是一个存放在栈内存中的指针，指向的实际内容存放在堆内存中。因此即使是内容相同的两个对象也是不相等的：
```javascript
{} === {} // false
let a = {
    name: 'a'
}
let b = {
    name: 'b'
}
let c = a;
a === b // false
a === c // true
```
### 对象的原型
- 直接创建的对象默认原型为Object，Object的原型是null
- 通过构造函数创建的对象原型是构造函数prototype属性指向的对象，所有的对象原型都可以追溯到Object，形成原型链。
