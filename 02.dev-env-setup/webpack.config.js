const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');

const ESLintPlugin = require('eslint-webpack-plugin');

// 设置Nodejs环境变量
process.env.NODE_ENV = 'development';

module.exports = {
  entry: './src/index.js',

  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build'),
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            /**
             * ! When I use  MiniCssExtractPlugin.loader replace of 'style-loader'
             * ! to loade css file with imges, it will show error...
             * ? How to solve it?
             * * solution: disable webpack url() handling from css-loader
             * * { loader: 'css-loader', options: { url: false } }
             */
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: resolve(__dirname, 'build'),
            },
          },
          {
            loader: 'css-loader',
            // options: { url: false },
          },
          {
            /**
             * *css兼容性处理： postcss -> postcss-loader postcss-preset-env
             *
             * * setup browserslist in 'package.json'
             *   browserslist":{...}
             * ! 开发环境 -> 设置node环境变量：process.env.NODE_ENV = 'development'
             *
             */
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['postcss-preset-env']],
              },
            },
          },

          /**
           * * 语法检查：eslint-loader eslint
           * !!! This loader has been deprecated. Please use eslint-webpack-plugin
           * ! only check sef code, do not check 3th part libs (node_modules)
           *  * check rules: package.json->eslintCnfig
           *  "eslintConfig": {
           *      "extends": "airbnb-base"
           *   }
           *  * airbnb -> eslint-config-airbnb or eslint-config-airbnb-base(without react)
           *  * request: eslint and eslint-plugin-import.
           * {
              test: /\.js$/,
              exclude: /node_modules/,
              loader: 'eslint-loader',
              options: {}
            },
           */
        ],
      },
      {
        test: /\.less$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            // options: { url: false }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['postcss-preset-env']],
              },
            },
          },
          'less-loader',
        ],
      },

      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          publicPath: 'imgs/',
          outputPath: 'imgs/',
        },
      },

      {
        exclude: /\.(html|js|css|less|png|svg|jpg|jpeg|gif)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
      {
        /**
         * * 1. 基本js兼容性处理：babel-loader @babel/core @babel/perset-env
         * ! 问题：只能转换基本语法，如promise不能转换
         * * 2. 全部js兼容性处理：@babel/polyfill
         * ! 问题：引入全部代码，体积太大
         * * 3.需要做兼容处理的才处理：按需加载 -> core-js
         * * 总结： 1 + 3
         */
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            // 预设：指定babel做怎么样的兼容性处理
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'usage',
                  corejs: {
                    version: 3,
                  },
                  targets: {
                    chrome: '60',
                    firefox: '50',
                    ie: '9',
                    safari: '10',
                    edge: '17',
                  },
                },
              ],
            ],
          },
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      // 压缩html代码
      monify: {
        // 删除空格
        collapseWhitespace: true,
        // 删除注释
        removeComments: true,
      },
    }),
    // save css into folder
    new MiniCssExtractPlugin({
      filename: 'css/built.css',
    }),
    // optimize css file by using 'css-minimizer-webpack-plugin'
    new CssMinimizerWebpackPlugin(),
    /**
     * * 语法检查：eslint eslint-webpack-plugin
     *  * check rules: package.json->eslintCnfig
     *  "eslintConfig": {
     *      "extends": "airbnb-base"
     *   }
     * * airbnb ->npm i eslint-config-airbnb or eslint-config-airbnb-base(without react)
     * * request: npm i eslint and eslint-plugin-import.
     */
    new ESLintPlugin({
      // by default
      extensions: 'js',
      // by default
      exclude: 'node_modules',
    }),
  ],

  mode: 'development',

  devServer: {
    static: resolve(__dirname, 'build'),
    compress: true,
    port: 3000,
    open: true,
  },
};
