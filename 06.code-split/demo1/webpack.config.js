const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * * 1.code split
 * *  1.1 方式1：配置多入口，生成单独的bundle文件。
 * *        缺点：不太灵活，每个文件都要配置
 */

module.exports = {
  // 单入口
  // entry: './src/index.js',
  entry: {
    // 多入口：有几个入口，输出几个bundle
    index: './src/index.js',
    print: './src/print.js',
  },

  output: {
    filename: 'js/[name].[contenthash:10].js',
    path: resolve(__dirname, 'build'),
    // 自动清空build文件夹
    clean: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      monify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
  ],

  mode: 'production',
};
