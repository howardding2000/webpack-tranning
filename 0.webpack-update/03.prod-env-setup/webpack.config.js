const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 定义nodejs环境变量：决定使用browserlist中的哪个环境
process.env.NODE_ENV = 'production';

// 复用loader
const commonCssLoader = [
  MiniCssExtractPlugin.loader,
  'css-loader',
  {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: () => [['postcss-preset-env']],
    },
  },
];

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'built.js',
    path: resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [...commonCssLoader],
      },
      {
        test: /\.less$/,
        use: [...commonCssLoader, 'less-loader'],
      },
      /**
       * ! 正常情况，一个文件只能被一个loader处理，
       * * 当一个问题要被多个loader处理时，要指定loader的执行顺序：
       * * 先执行eslint 再执行babel
       */
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: 'usage',
                corejs: { version: 3 },
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

      {
        test: /\.(png|svg|jpg|jpeg|gif)?/i,
        type: 'asset/resource',
        generator: {
          publicPath: 'imgs',
          outputPath: 'imgs',
        },
      },

      {
        exclude: /\.(html|js|css|less|png|svg|jpg|jpeg|gif)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'media',
        },
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/built.css',
    }),
    new CssMinimizerWebpackPlugin(),

    new ESLintPlugin({
      extensions: 'js',
      exclude: 'node_modules',
    }),

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
