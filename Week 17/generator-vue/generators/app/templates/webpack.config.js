const webpack = require('webpack'); // 用于访问内置插件
const VueLoaderPlugin = require('vue-loader/lib/plugin') // vue-loader允许使用Vue SFC

const config = {
    entry: "./src/main.js",
    module: {
        rules: [
            { 
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [ 'vue-style-loader', 'css-loader' ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};

module.exports = config;