const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const server = require('./src/server')

module.exports = {
  mode: 'development',
  entry: path.resolve('src', 'client', 'index.js'),

  devServer: {
    before: server,
    stats: 'errors-warnings',
  },

  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve('src', 'client', 'index.html'),
    }),
  ],

  resolve: {
    alias: {
      '@components': path.resolve('src', 'client', 'components'),
    },
  },

  module: {
    rules: [
      {
        test: /\.pug$/,
        use: 'pug-plain-loader',
      },
      {
        test: /\.styl(us)?$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'stylus-loader',
            options: {
              // Automatically import these style files globally.
              import: [
                path.resolve('src', 'client', 'styles', 'colors'),
                path.resolve('src', 'client', 'styles', 'mixins'),
              ],
            },
          },
        ],
      },
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.(woff2?|ttf|eot)$/,
        use: 'file-loader',
      },
    ],
  },
}
