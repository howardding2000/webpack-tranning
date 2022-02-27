/**
 * *webpack config file
 * 1.entry
 * 2.output
 * 3.module: ->rules[]->{test,use[]}loader config
 * 4.plugins
 * 5.mode:set development or production environment
 */
const { resolve } = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  /**
   * * 1.entry point
   */

  entry: {
    index: './src/index.js',
    pringt: './src/print.js',
  },

  /**
   * * 2.output config
   * * filename: output file name
   * * path: output path
   */

  output: {
    //
    filename: '[name].built.js',

    /**
     * *__dirname: A variale of nodejs.
     * *The path to the directory where the current file is located.
     */
    path: resolve(__dirname, 'build'),
    clean: true,
  },

  /**
   * * 3.module config
   */
  module: {
    rules: [
      /**
       * * loaders config
       * ! process: download -> use
       */
      {
        // 匹配哪些文件
        test: /\.css$/i,
        // 使用哪些loader
        use: [
          // ! use数组中执行顺序：从右到左，自下而上
          // 创建style标签，将js中的样式资源插入进去，添加到head中生效
          'style-loader',
          // 将css文件编译commonjs模块加载到js中，里面内容是样式字串
          'css-loader',
        ],
      },
      // loader for less file
      {
        test: /\.less$/i,
        use: [
          'style-loader',
          'css-loader',
          // 将less编译成css
          // npm i less less-loader
          'less-loader',
        ],
      },
      /**
       * ! in Webpack 5, Asset Modules type replaces 'raw-loader', 'url-loader', 'file-loader' by 4
       * ! new module types:
       * * asset/resource (replace file-loader)
       * * asset/inline (replace url-loader)
       * * asset/source (replace raw-loader)
       * * asset （replace url-loader)
       */
      // loader for images
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      // loader for fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      // loader for data
      {
        test: /\.(csv|tsv)$/i,
        use: ['csv-loader'],
      },
      {
        test: /\.xml$/i,
        use: ['xml-loader'],
      },
    ],
  },

  /**
   * * plugins config
   * ! Process：download->import->use
   */
  plugins: [
    // html-webpack-plugin
    new HTMLWebpackPlugin({
      title: 'Output Management',
      // setup a template html
      template: './src/index.html',
    }),
  ],

  /**
   * * set 'development' or 'production' environment
   */
  mode: 'development',
  /**
   * ! setup develop-server: auto compile
   * * npm install -D webpack-dev-server
   * * run: npx webpack serve
   */
  devServer: {
    static: resolve(__dirname, 'build'),
    compress: true,
    port: 3000,
    // auto open default browse
    open: true
  },
};
