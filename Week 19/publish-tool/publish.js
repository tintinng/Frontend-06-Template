let http = require("http");
let fs = require("fs");
let archiver = require("archiver");
let child_process = require("child_process");
let querystring = require('querystring');

//1. 打开：GET https://github.com/login/oauth/authorize
child_process.exec(`start https://github.com/login/oauth/authorize?client_id=Iv1.de566d41579b5e86`)
//3. 创建server，接受token，后点击发布
http.createServer(function(request, response) {
    let query = querystring.parse(request.url.match(/^\/\?([\s\S]+)$/)[1]);
    publish(query.token);
}).listen(8083);

function publish(token) {
    fs.stat("./sample.html", (err, stats) => {
        let request = http.request({
            // publish-server hostname
            hostname: "127.0.0.1",
            // publish-server port
            port: 8082,
            method: "post",
            path: `/publish?token=` + token,
            headers: {
                'Content-Type': 'application/octet-stream'
            }
        }, response => {
            console.log(response);
        })
        
        // // 创建读入流，读取本地文件
        // let file = fs.createReadStream("./sample.html");
    
        const archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
        });
        archive.directory('./sample/', false);
        archive.finalize();
    
        // 导到本地文件流
        // archive.pipe(fs.createWriteStream('tmp.zip'));
    
        // 导到http流
        archive.pipe(request);
        
        // 直接从一个读入流导到一个写入流里面
        // file.pipe(request);
        // file.on('end', () => request.end())
    })
}


// 当读入流收到数据块后触发
/*
file.on('data', chunk => {
    console.log(chunk.toString());
    // 发送一个请求体数据块，写入request流
    request.write(chunk);
})
// 当读入流中没有数据后触发
file.on('end', chunk => {
    console.log("read finished");
    // 完成发送请求
    request.end(chunk);
})
 */