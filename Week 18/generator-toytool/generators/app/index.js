var Generator = require('yeoman-generator')

module.exports = class extends Generator {
    
    constructor(args, opts) {
        super(args, opts);
    }

    // 初始化
    async initPackage() {

        // 命令行交互
        let answer = await this.prompt([
            {
                type: "input",
                name: "name",
                message: "Your project name",
                default: this.appname
            }
        ])

        const pkgJson = {
            // 初始化项目名称
            "name": answer.name,
            "version": "1.0.0",
            "description": "",
            "main": "generators/app/index.js",
            "scripts": {
                "build": "webpack",
                "test": "mocha --require @babel/register",
                "coverage": "nyc mocha --require @babel/register"
            },
            "author": "",
            "license": "ISC",
            "devDependencies": {

            },
            "dependencies": {

            }
        }

        // 生成package.json
        this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
        // 自动安装对应依赖
        this.npmInstall(["vue"], { "save-dev": false });
        this.npmInstall(["webpack", "webpack-cli", "vue-loader", "vue-style-loader","babel-loader",
            "babel-plugin-istanbul","@istanbuljs/nyc-config-babel",
            "@babel/core","@babel/preset-env","@babel/register",
            "mocha","nyc",
            "css-loader", "vue-template-compiler", "copy-webpack-plugin"],
            { "save-dev": true });
        this.npmInstall(["mocha"], { "save-dev": true });
        this.npmInstall(["nyc"], { "save-dev": true });
        
        this.fs.copyTpl(
            this.templatePath('sample-test.js'),
            this.destinationPath('test/sample-test.js'),
            {}
        )
        this.fs.copyTpl(
            this.templatePath('.babelrc'),
            this.destinationPath('.babelrc'),
            {}
        )
        this.fs.copyTpl(
            this.templatePath('.nycrc'),
            this.destinationPath('.nycrc'),
            {}
        )
        this.fs.copyTpl(
            this.templatePath('HelloWorld.vue'),
            this.destinationPath('src/HelloWorld.vue'),
            {}
        )
        this.fs.copyTpl(
            this.templatePath('webpack.config.js'),
            this.destinationPath('webpack.config.js')
        )
        this.fs.copyTpl(
            this.templatePath('main.js'),
            this.destinationPath('src/main.js')
        )
        this.fs.copyTpl(
            this.templatePath('index.html'),
            this.destinationPath('src/index.html'),
            { title: answer.name }
        )
    }
}