import path from 'path'
import webpack from 'webpack'
import { VueLoaderPlugin } from 'vue-loader'

const config: webpack.Configuration = {
  mode: 'development',
  entry: path.resolve('src', 'client', 'index.ts'),

  resolve: {
    alias: {
      '@components': path.resolve('src', 'client', 'components')
    }
  },

  plugins: [new VueLoaderPlugin()],

  module: {
    rules: [
      {
        test: /\.pug$/,
        use: 'pug-plain-loader'
      },
      {
        test: /\.styl(us)?$/,
        use: ['vue-style-loader', 'css-loader', 'stylus-loader']
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/]
          }
        }
      }
    ]
  }
}

export default config
