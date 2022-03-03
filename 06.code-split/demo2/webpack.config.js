const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * * 1.code split
 * *  1.1 方式1：配置多入口，生成单独的bundle文件。
 * *        缺点：不太灵活，每个文件都要配置
 * !  1.2 方式2：配置optimization->splitChunks->chunks，公共文件会打包成单独chunk
 *      optimization: {
          splitChunks: {
            chunks: 'all',
          },
        },
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
  /**
   * 1.可以将node_modules中代码单独打包一个chunk最终输出
   * 2.自动分析多入口chunk中，有没有公共的文件。如果有，会打包成单独的一个chunk
   */
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  mode: 'production',
};
