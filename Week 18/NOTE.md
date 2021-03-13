学习笔记
## 工具链
### 脚手架生成器
#### yeoman-generator

### build工具
#### webpack
- 最初设计能力：把node代码打包成可在浏览器运行的js代码，然后使用html引用最终生成的js文件，通过loader和plugin实现多文件合并。
- webpack-cli：包括了webpack命令
```webpack命令优先从全局里找，在package.json里加入脚本则会优先从当前项目里找```
- webpack.config.js
  - entry：一个文件及其依赖文件的打包
  - output：输出的文件名和路径
  - loader：source => target code （纯粹的文本转换）
    - test：什么样的文件使用什么样的loader
#### babel （独立工具）
- 新版本js => 老版本js
- babel配置：使用presets（babel配置繁琐，将一套配置存成presets），使用需要安装
- babel可以作为命令独立使用
- 通常是使用babel-loader使用，使用现成的preset和一些插件
### 单元测试工具
#### Mocha
- 配合 ```@babel/core、@babel/preset-env和@babel/register```使用新语法
- 使用local mocha 命令而不是全局
  - 在scripts里使用脚本可以优先使用local里的模块

#### nyc
- code coverage：测试到底覆盖了原文件的哪些代码