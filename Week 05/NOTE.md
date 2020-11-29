学习笔记
## Proxy学习总结
JavaScript中的Proxy用于给目标对象定义一个与之关联的代理对象，这个代理对象可以作为抽象的目标对象来使用。
### 代理基础
- Target  ———— 被代理的目标对象
- Traps   ———— 用来代理Target对应的属性或方法
- Handler ———— 用来存储Traps的一个对象

对于对象的大部分操作，都有一些对应的内部方法，比如：读取属性对应```[[Get]]```，给属性赋值对应```[[Set]]```等等。这些内部方法无法直接调用，但是都对应了Proxy中的traps（捕获器）。因此使用Proxy的主要目标就是设置traps（捕获器）拦截对应的操作，加入自定义的一些逻辑。

例如：创建一个Proxy拦截读取操作的代理：
```javascript
let numbers = [0, 1, 2];
// 第一个参数是target，第二个参数就是handler
numbers = new Proxy(numbers, {
    // trap
    // 所有的traps都可以访问相应的参数
    // get会接收到目标对象target、要查询的属性prop和代理对象receiver三个参数 
  get(target, prop) {
      // 自定义逻辑
    if (prop in target) {
      return target[prop];
    } else {
      return NaN; // 默认值
    }
  }
});

alert( numbers[1] ); // 1
alert( numbers[123] ); // NaN (没有对应的数)
```
### 不变式 trap invariant

使用traps必须遵循“捕获器不变式”（trap invariant），可以理解为使用代理对象拦截操作不能改变了操作的本质，比如要读取一个对象属性，最终的结果就是返回原来的属性值，而不能是别的操作。就像上述代码中最终还是返回一个值。

### 反射 Reflect
Reflect是一个内置对象，对于Proxy中的每一个trap，Reflect都有对应的方法，因此可以使用Reflect对应的方法直接转发操作。Reflect也让```[[Get]]、[[Set]]```等内部方法的调用成为可能。
```javascript
let numbers = [0, 1, 2];
numbers = new Proxy(numbers, {
  get(target, prop, receiver) {
    if (prop in target) {
        // 直接转发操作
      return Reflect.get(target, prop, receiver);
    } else {
      return NaN;
    }
  }
});

alert( numbers[1] ); // 1
alert( numbers[123] ); // NaN 
```
### 应用场景
- 赋值验证Validation
```javascript
const handler = {
	set: function (target, prop, value) {
		const houses = ['Stark', 'Lannister'];
		if (prop === 'house' && !(houses.includes(value))) {
			throw new Error(`House ${value} does not belong to allowed ${houses}`)
		}
		target[prop] = value
	}
};

const gotCharacter = new Proxy({}, handler);

gotCharacter.name = "Jamie";
gotCharacter.house = "Lannister";

console.log(gotCharacter);

gotCharacter.name = "Oberyn";
gotCharacter.house = "Martell";
```