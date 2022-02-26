/*

webpack configuration file

*/

const { resolve } = require('path');

module.exports = {
  entry: '/src/index.js',

  output: {
    filename: 'built.js',

    //__dirname: A variale of nodejs.
    // The path to the directory where the current file is located.
    path: resolve(__dirname, 'build'),
  },

  module: {
    rules: [
      // loader config

      {
        //匹配哪些文件
        test: /\.css$/,
        // 使用哪些loader
        use: [
          // use数组中执行顺序：从右到左，自下而上
          // 创建style标签，将js中的样式资源插入进去，添加到head中生效
          'style-loader',
          // 将css文件编译commonjs模块加载到js中，里面内容是样式字串
          'css-loader',
        ],
      },

      {
        //匹配哪些文件
        test: /\.less$/,
        // 使用哪些loader
        use: [
          'style-loader',
          'css-loader',
        //  将less编译成css
        // npm i less less-loader
          'less-loader',
        ],
      },
    ],
  },

  plugins: [],

  // development or production
  mode: 'development',
};
