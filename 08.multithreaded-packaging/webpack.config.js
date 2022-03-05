const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const webpack = require('webpack');

process.env.NODE_ENV = 'production';

/**
 * * 1.multithreaded packaging: thread-loader，一般给babel-loader用
 * * 2.externals: 防止一些不必要的资源被打包
 * * 3.dll：单独拆分打包库文件
 * * 3.1 配置在webpack.dll.js中, 配置单独打包
 * * 3.2 在webpack.config.js中告诉webpack哪些库不需要打包
 */

const CommonCssLoader = [
  {
    loader: MiniCssExtractPlugin.loader,
    options: {
      publicPath: resolve(__dirname, 'build'),
    },
  },
  {
    loader: 'css-loader',
  },
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [['postcss-preset-env']],
      },
    },
  },
];

module.exports = {
  entry: './src/index.js',

  output: {
    filename: 'js/built.[contenthash:10].js',
    path: resolve(__dirname, 'build'),
    clean: true,
  },

  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.css$/i,
            use: [...CommonCssLoader],
          },
          {
            test: /\.less$/i,
            use: [...CommonCssLoader, 'less-loader'],
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
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: [
              /**
               * 开启多进程打包，进程开启有时间，大概为600ms，进程通信也有开销。
               * 只有工作消耗时间比较长，才需要多进程打包。
               */
              {
                loader: 'thread-loader',
                options: {
                  // 设置进程为2
                  worker: 2,
                },
              },
              {
                loader: 'babel-loader',
                options: {
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
                  cacheDirectory: true,
                },
              },
            ],
          },
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      monify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'css/built.[contenthash:10].css',
    }),
    new CssMinimizerWebpackPlugin(),

    new ESLintPlugin({
      extensions: 'js',
      exclude: 'node_modules',
    }),
    // 告诉webpack哪些库文件不参与打包，同时使用时的文件名也需要更改
    new webpack.DllReferencePlugin({
      manifest: resolve(__dirname, 'dll/manifest.json'),
    }),
  ],

  mode: 'production',

  externals: {
    // 拒绝jQuery被打包进来，如果还需要使用该资源，需要cdn引入
    // 库名 -- npm包名
    jquery: 'jQuery',
  },

  devServer: {
    static: resolve(__dirname, 'build'),
    compress: true,
    port: 3000,
    open: true,
    watchFiles: ['./src/index.html'],
  },

  devtool: 'eval-source-map',
};
