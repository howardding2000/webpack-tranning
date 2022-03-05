/**
 * * 使用dll技术对某些库（第三方：jquery，react，vue...）单独打包
 * ! 当运行webpack时，默认查找的是webpack.config.js配置文件
 * ! 需求：需要运行 webpack.dll.js文件
 * ! 运行：--> webpack --config webpack.dll.js
 */

const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    // jquery--> 最终打包成的name
    // ['jquery']--> 要打包的库是jquery
    jquery: ['jquery'],
  },

  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'dll'),
    // library: 打包的库里面向外暴露出去的内容名称
    library: '[name]_[hash]',
  },

  plugins: [
    //   打包生成一个 manifest.jso文件 -->提供和jquery映射
    new webpack.DllPlugin({
      // 映射库暴露内容的名称
      name: '[name]_[hash]',
      //  输出文件路径
      path: resolve(__dirname, 'dll/manifest.json'),
    }),
  ],
};
