let http = require('http');
let https = require('https');
let fs = require('fs');
let unzipper = require('unzipper');
let querystring = require('querystring');

//2. auth路由：接收code，用code + client_id + client_secret 换 token
function auth(request, response) {
    let query = querystring.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1]);
    getToken(query.code, function(info) {
        // console.log(info);
        // response.write(JSON.stringify(info));
        response.write(`<a href='http://localhost:8083/?token=${info.access_token}'>publish</a>`)
        response.end();
    });
}

function getToken(code, callback) {
    let request = https.request({
        hostname: "github.com",
        path: `/login/oauth/access_token?code=${code}&client_id=Iv1.de566d41579b5e86&client_secret=76e2fbc80f5836fcbd5bfbf9fee5e9f92c023bbe`,
        port: 443,
        method: "POST"
    }, function(response){
        let body = "";
        response.on('data', chunk => {
            body += chunk.toString();
        })
        response.on('end', chunk => {
            callback(querystring.parse(body));
        })
    });
    request.end();
}

//4. publish路由：用token获取用户信息，检查权限，接受发布
function publish(request, response) {
    // 创建写入流
    let query = querystring.parse(request.url.match(/^\/publish\?([\s\S]+)$/)[1]);
    if (query.token) {
        getUser(query.token, function(info) {
            if (info.login === 'tintinng') {
                request.pipe(unzipper.Extract({ path: '../server/public/' }))
                request.on('end', function() {
                    response.end('success!');
                })
            }
        });
    }
}

function getUser(token, callback) {
    let request = https.request({
        hostname: "api.github.com",
        path: `/user`,
        port: 443,
        method: "GET",
        headers: {
            Authorization: `token ${token}`,
            "User-Agent": 'tintin-publish'
        }
    }, function(response){
        let body = "";
        response.on('data', chunk => {
            body += chunk.toString();
        })
        response.on('end', chunk => {
            callback(JSON.parse(body));
        })
    });
    request.end();
}

http.createServer(function(request, response) {
    if (request.url.match(/^\/auth\?/)) {
        return auth(request, response);
    }
    if (request.url.match(/^\/publish\?/)) {
        return publish(request, response);
    }
    // console.log("request");
    
    // 写入到实际的服务文件中
    // let outFile = fs.createWriteStream("../server/public/tmp.zip");
    // 直接从一个读入流导到一个写入流里面
    // request.pipe(outFile);
    
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