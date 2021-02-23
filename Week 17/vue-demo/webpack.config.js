const webpack = require("webpack");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
// const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/main.js",
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    // make sure to include the plugin!
    new VueLoaderPlugin()
  ],
};