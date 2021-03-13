学习笔记

## 发布系统
- 目标：从本地读取文件通过http发送到线上服务器
- 服务器上另开一个发布服务监听来自publish的文件传输，收到后写入线上服务的文件中
### server
- 线上服务脚本：从本机scp到服务器
```json
"scripts": {
    "publish": "scp -r -P 端口 ./* 服务器主机名:/文件路径/server-name ",
    "test": "echo \"Error: no test specified\" && exit 1"
}
```
### publish-server
- 线上服务脚本：从本机scp到服务器
```json
"scripts": {
    "publish": "scp -r -P 端口 ./* 服务器主机名:/文件路径/server-name ",
    "test": "echo \"Error: no test specified\" && exit 1"
}
```
### publish
## Node流式传输
### readStream
- 使用node可以从流中获取数据
- 对于大型文件（音视频、文件等binary的文件），无法一次性读取。监听以下两个event
  - data event 
  - close event
### writeStream
- write方法：往流中写数据
- end方法：结束流
- drain event：写入流的数据已经写完了
## 多文件传输
### archiver
- 压缩文件夹
### unzipper
- 解压文件夹