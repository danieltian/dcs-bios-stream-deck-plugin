import path from 'path'
import webpack from 'webpack'
import { VueLoaderPlugin } from 'vue-loader'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import server from './src/server'

const config: webpack.Configuration = {
  mode: 'development',
  entry: path.resolve('src', 'client', 'index.ts'),

  devServer: {
    before: server,
    stats: 'errors-warnings'
  },

  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve('src', 'client', 'index.html')
    })
  ],

  resolve: {
    alias: {
      '@components': path.resolve('src', 'client', 'components'),
      '@shared': path.resolve('src', 'client', 'components', 'shared')
    }
  },

  module: {
    rules: [
      {
        test: /\.pug$/,
        use: 'pug-plain-loader'
      },
      {
        test: /\.styl(us)?$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'stylus-loader',
            options: {
              import: [
                path.resolve('src', 'client', 'styles', 'colors'),
                path.resolve('src', 'client', 'styles', 'mixins')
              ]
            }
          }
        ]
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: { appendTsSuffixTo: [/\.vue$/] }
        }
      },
      {
        test: /\.(woff2?|ttf|eot)$/,
        use: 'file-loader'
      }
    ]
  }
}

export default config
