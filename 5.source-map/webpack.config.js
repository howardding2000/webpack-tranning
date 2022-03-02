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
    // 自动清空build文件夹
    clean: true,
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

  /**
   * ! source-map : 一种提供源代码到构建后代码的映射技术
   * !（如果构建代码出错，可以通过映射追踪到源代码出错位置）
   * * [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map
   * * 内联和外联区别->1. 外部生产文件，内联不生成；2.内联构建速度更快
   * * -能提示到错误原因 ? 1-Y : 2-/
   * * -能追踪到源代码错误位置 ? 2-Y : 2-/
   * * inline-source-map:       内联，1-Y，2-Y，只生成一个source-map。1-Y，2-Y
   * * hidden-source-map：      外部，1-Y，2-/，隐藏源代码
   * * eval-source-map:         内联，1-Y，2-Y，每个文件都生成一个source-map，都在eval中
   * * nosources-source-map：   外部，1-Y，2-/，隐藏源代码
   * * cheap-source-map：       外部，1-Y，2-Y，只精确到行，无列信息
   * * cheap-module-source-map：外部，1-Y，2-Y，只精确到行，无列信息
   * ? 考虑因素
   * ?  -开发环境：速度快，调试更友好
   * !  速度：eval>inline>cheap...
   * *  eval-cheap-source-map
   * *  eval-source-map
   * *  调试更友好
   * *  source-map
   * *  cheap-module-source-map
   * *  cheap-souce-map
   * ! Vue & React 默认使用 -> cheap-souce-map
   * ?  -生产环境：源代码要不要隐藏？调试要不要更友好？
   * ! 内联体积非常大，首先排除
   * *  hidden-source-map 只隐藏源代码
   * *  nosources-source-map 全部隐藏
   * *  --> source-map / cheap-module-souce-map
   */
  devtool: 'eval-source-map',
};
