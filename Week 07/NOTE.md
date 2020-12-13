学习笔记
## 表达式和运算符
### 表达式优先级
#### Member
```javascript
a.b // 成员访问
a[b]  // 可计算属性(运行时会将b作为表达式处理)
foo`string` // 标签函数
super.b
super['b']
new.target
new Foo()
```
#### New
```javascript
new Foo // 不带圆括号的构造

new a()()   // 第一个()跟着new运算结合
new new a() // ()和第二个new运算结合
```
#### Call
```javascript
foo()   // 函数调用
super()
foo()['b']  // Member Expression降级为Call Expression
foo().b
foo()`abc`
```
#### Update
从这里开始都是 Right Handside Expression，不可以被赋值
```javascript
a++、a--、++a、--a
```
#### Unary
```javascript
delete a.b
void foo()  // 不管啥都变成 undefined
typeof a
+ a
- a
~ a // 整数按位取反
! a
await a
```
#### Exponental
```javascript
** // 右结合
2 ** 1 ** 2  => 2 ** (1 ** 2)   // 结果是2
```
#### Multiplicative
```javascript
*、/、%
```
#### Additive
```javascript
+、-
```
#### Shift
```javascript
<<、>>、>>>
```
#### Relationship
```javascript
<、>、<=、>=、instanceof、in
```
#### Equality
```javascript
==、!=、===、!==
```
#### Bitwise
```javascript
&、^、|
```
#### Logical
```javascript
&&、||
```
#### Conditional
```javascript
?:
```
### 类型转换
#### a + b
- 作用于两个数字之间
- 数字 + 字符串：数字转换为字符串
#### "false" == false
- 类型相同可以比较
- 类型不同转为Number比较

#### Unboxing
- toString
- valueOf
- Symbol.toPrimitive

## JavaScript语句和声明
### 简单语句
#### ExpressionStatement 
#### EmptyStatement
#### DebuggerStatement
#### ThrowStatement
 - 抛出一个异常
#### ContinueStatement
- 结束当次循环
#### BreakStatement
- 结束整个循环
#### ReturnStatement

### 复合语句
#### BlockStatement
#### IfStatement
#### SwitchStatement
#### IterationStatement
```
while、do-while、for、for-in、for-of......
```
#### LabelledStatement
#### TryStatement
### 声明
#### FunctionDeclaration
```
function
```
#### GeneratorDeclaration
```
function *
```
#### AsyncFunctionDeclaration
```
async function
```
#### AsyncGeneratorDeclaration
```
async function *
```
#### VariableStatement
```
var
```
#### ClassDeclaration
```
class
```
#### LexicalDeclaration
```
const、let
```
### 预处理（pre-process）
- 提前找到所有的var变量并使它生效
- var、let、const都有预处理，只是let、const在声明之前使用会抛错

## 宏任务与微任务
## 函数调用
### 执行上下文
- code evaluation state：用于async和generate函数
- Function
- Script or Module
- Generator
- Realm：保存所有内置对象
- LexicalEnvironment：词法环境
```javascript
this \ new.target \ super \ 变量
```
- VariableEnvironment：变量环境
```javascript
仅仅用于处理var声明
```