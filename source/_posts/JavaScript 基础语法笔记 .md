---
title: JavaScript 基础语法笔记
Translate_title: Send-the-stone-again
comments: true
tags: 
  - 知识
  - 笔记
published: true
layout: post
date: 2025-03-06 21:11:06
---

### JavaScript 基础语法笔记

## **变量**

JavaScript 变量用于存储数据，可以通过 `var`、`let` 和 `const` 进行声明。

### 1. `var`

- 变量可以被重新声明和赋值。
- `var` 声明的变量存在**变量提升**（Hoisting），即可以在声明之前使用，值为 `undefined`。
- `var` 没有块级作用域，只有函数作用域。

```js
console.log(a); // 输出 undefined（变量提升）
var a = 10;
var a = 20; // 允许重复声明
console.log(a); // 输出 20
```

### 2. `let`（推荐使用）

- 变量可以重新赋值，但不能重复声明。
- **具有块级作用域**，在 `{}` 代码块外无法访问。
- 不存在变量提升，访问前必须先声明。

```js
let b = 10;
b = 20; // 可以重新赋值
console.log(b); // 输出 20

{
  let c = 30;
  console.log(c); // 输出 30
}
// console.log(c); // ❌ 报错，c 在块级作用域外无法访问
```

### 3. `const`（常量，不可变）

- 变量声明后**不能被重新赋值**。
- **必须在声明时初始化值**，否则会报错。
- 具有块级作用域。

```js
const PI = 3.14;
// PI = 3.1415; // ❌ 报错：Assignment to constant variable

const obj = { name: "张三" };
obj.name = "李四"; // ✅ 允许修改对象属性
// obj = {}; // ❌ 报错，不能修改整个对象的引用
```
<!-- more -->
### 4. 命名规则

- 变量名不能以数字开头，如 `1var` ❌
- 严格区分大小写，如 `abc` 与 `ABC` 是不同变量
- 不能使用 JavaScript 关键字（如 `let`, `class`, `function` 等）
- 允许使用 `$` 和 `_`，如 `var $name = "Tom";` ✅

---

## **数据类型**

JavaScript 是**动态类型语言**，变量的数据类型可以随时更改。

### 1. **基本数据类型（原始类型 Primitive）**

基本数据类型直接存储在栈（Stack）中，赋值时是**值拷贝**。

- **`boolean`（布尔型）**：`true` 或 `false`
- **`number`（数字型）**：包括整数、浮点数（64 位双精度）、`NaN`、`Infinity`
- **`string`（字符串）**：使用 `""` 或 `''` 或 `` ` ``
- **`null`（空）**：表示对象为空
- **`undefined`（未定义）**：变量声明但未赋值时的默认值
- **`bigInt`（大整数型）**：用于表示比 `Number.MAX_SAFE_INTEGER` 更大的整数，后缀 `n`
- **`symbol`（符号型）**：ES6 引入，创建唯一标识符

```js
let isTrue = true; // boolean
let age = 25; // number
let name = "Alice"; // string
let empty = null; // null
let notDefined; // undefined
let bigNumber = 9007199254740991n; // bigInt
let uniqueKey = Symbol("id"); // symbol
```

### 2. **引用数据类型（对象 Object）**

存储在**堆（Heap）**中，赋值时是**引用传递**。

- `Object`（对象）
- `Array`（数组）
- `Function`（函数）
- `Date`（日期）
- `RegExp`（正则表达式）

```js
let obj = { name: "Tom", age: 30 }; // Object
let arr = [1, 2, 3]; // Array
function sayHello() {
  console.log("Hello!");
} // Function
```

### **数据类型判断**

- `typeof` 用于检查基本类型（但 `null` 也返回 `object`）
- `instanceof` 用于判断引用类型

```js
console.log(typeof 10); // "number"
console.log(typeof "Hello"); // "string"
console.log(typeof null); // "object"（JS 早期遗留问题）
console.log(typeof undefined); // "undefined"
console.log(typeof {}); // "object"
console.log(typeof function () {}); // "function"

console.log([] instanceof Array); // true
console.log({} instanceof Object); // true
console.log(function () {} instanceof Function); // true
```

---

## **类型转换**

### 1. **隐式转换（自动类型转换）**

JavaScript 在某些操作时会自动转换数据类型。

```js
console.log("5" - 2); // 3（字符串 "5" 被转换为数字）
console.log("5" + 2); // "52"（数字 2 被转换为字符串）
console.log("5" * "2"); // 10（字符串转换为数字）
console.log(5 + true); // 6（true 转换为 1）
console.log(5 + false); // 5（false 转换为 0）
console.log(5 + null); // 5（null 转换为 0）
console.log(5 + undefined); // NaN（undefined 转换失败）
```

### 2. **显式转换**

- `Number(value)`：转换为数字
- `String(value)`：转换为字符串
- `Boolean(value)`：转换为布尔值
- `parseInt(value, base)` / `parseFloat(value)`：转换为整数或浮点数

```js
console.log(Number("123")); // 123
console.log(Number("abc")); // NaN
console.log(String(123)); // "123"
console.log(Boolean(0)); // false
console.log(Boolean(1)); // true
console.log(parseInt("100px", 10)); // 100
console.log(parseFloat("3.14")); // 3.14
```

---

## **小结**

1. **变量声明**

   - `let` 和 `const` 具有块级作用域，`var` 不推荐使用
   - `const` 声明的变量不可重新赋值，但对象属性可修改

2. **数据类型**

   - **基本类型**：`boolean`、`number`、`string`、`null`、`undefined`、`bigInt`、`symbol`
   - **引用类型**：`object`（对象、数组、函数等）
   - `typeof` 可用于检查数据类型，但 `null` 会返回 `"object"`（历史遗留问题）

3. **类型转换**
   - `+` 连接字符串时会转换为 `string`
   - `-`、`*`、`/` 会尝试转换为 `number`
   - 显式转换可以使用 `Number()`、`String()`、`Boolean()`

---
