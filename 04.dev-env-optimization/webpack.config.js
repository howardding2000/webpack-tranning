const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');

const ESLintPlugin = require('eslint-webpack-plugin');

// 设置Nodejs环境变量
process.env.NODE_ENV = 'development';

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
    filename: 'js/built.js',
    path: resolve(__dirname, 'build'),
  },

  module: {
    rules: [
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
        use: {
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
          },
        },
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
      filename: 'css/built.css',
    }),
    new CssMinimizerWebpackPlugin(),

    new ESLintPlugin({
      extensions: 'js',
      exclude: 'node_modules',
    }),
  ],

  mode: 'development',

  devServer: {
    static: resolve(__dirname, 'build'),
    compress: true,
    port: 3000,
    open: true,
    /**
     * ! set HMR on
     * ! 1. by defaule 'hot' is 'true'
     *      ->hot: true,
     * * 2. set Html HMR on ->  watchFiles: ['./src/index.html'],
     * * 3. Vue and React have their own HRM plugins
     */
    watchFiles: ['./src/index.html'],
  },

};
