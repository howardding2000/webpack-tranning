const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');

const ESLintPlugin = require('eslint-webpack-plugin');

process.env.NODE_ENV = 'development';

/**
 * * 1.自动清空build文件夹
 * * 2.source-map
 * * 3.oneOf-> 一个文件类型只匹配一个loader执行
 * * 4.cache:
 * * 4.1. babel缓存
 * !        cacheDirectory: true
 * * 4.2. 文件资源缓存
 *          hash: 每次构建时，生成唯一的hash值
 *            问题: 因为js和css同时使用一个hash值，如果重新打包，将导致所有缓存都失效
 *          chunkhash：根据chunk生成的hash。如果打包来源于同一个chunk，那么hash值一样
 *            问题： js和css的hash值还是一样的，因为css是在js中被引进来的
 * !        contenthash：根据文件内容生成hash值，文件内容不变，hash值不变（上线代码性能优化)
 * *5.tree shaking:去除无用代码
 *    前提：1.必须使用ES6 module，2.mode开启production
 *    作用：减少代码体积
 * *6.code split:主要针对js.
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
    // 自动清空build文件夹
    clean: true,
  },

  module: {
    rules: [
      {
        // oneOf里面的loader，每个文件只会匹配一个loader
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
                /**
                 * 开启babel缓存
                 * 第二次构建时，会读取之前的缓存
                 */
                cacheDirectory: true,
              },
            },
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
  ],

  mode: 'production',

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
