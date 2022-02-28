# webpack-tranning

```js
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');

// 设置Nodejs环境变量
process.env.NODE_ENV = 'development';

module.exports = {
  entry: './src/index.js',

  output: {
    filename: 'built.js',
    path: resolve(__dirname, 'build'),
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            /**
             * ! When I use  MiniCssExtractPlugin.loader replace of 'style-loader' to loade css file with imges, it will show error...
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
            options: { url: false },
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
           * ! 语法检查：eslint-loader eslint
           * ! only check sef code, do not check 3th part libs
           *  * check rules: package.json->eslintCnfig
           *  * airbnb -> eslint-config-airbnb or eslint-config-airbnb-base(without react)
           *  * request: eslint and eslint-plugin-import.
           */
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'eslint-loader',
            options: {

            }
          }
        ],
      },
      {
        test: /\.less$/i,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { url: false } },
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
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    // save css into folder
    new MiniCssExtractPlugin({
      filename: 'css/built.css',
    }),
    // optimize css file by using 'css-minimizer-webpack-plugin'
    new CssMinimizerWebpackPlugin()
  ],

  mode: 'development',

  devServer: {
    static: resolve(__dirname, 'build'),
    compress: true,
    port: 3000,
    open: true,
  },
};

```
