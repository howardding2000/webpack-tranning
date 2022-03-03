const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * * 1.lazy loading
 *
 *      import('./test').then(({ mul }) => {
 *        console.log(mul(4, 5));
 *      });
 */

module.exports = {
  entry: './src/index.js',

  output: {
    filename: 'js/[name].[contenthash:10].js',
    path: resolve(__dirname, 'build'),
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

  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  mode: 'production',
};
