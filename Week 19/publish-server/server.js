let http = require('http');
let fs = require('fs');
let unzipper = require('unzipper')

http.createServer(function(request, response) {
    console.log("request");

    // 创建写入流
    // 写入到实际的服务文件中
    // let outFile = fs.createWriteStream("../server/public/tmp.zip");

    // 直接从一个读入流导到一个写入流里面
    // request.pipe(outFile);

    request.pipe(unzipper.Extract({ path: '../server/public/' }))

    /*
    // 收到数据后触发
    request.on('data', chunk => {
        outFile.write(chunk);
    })
    // 数据接受完后触发
    request.on('end', chunk => {
        outFile.end();
        response.end("-----Success-----")
    })
    */
}).listen(8082);