const path = require('path')

const merge = require('webpack-merge')

const commonConfig = require('./common.config')

module.exports = merge(commonConfig, {
  module: {
    rules: [
      {
        test: /\.(s?css|sass)$/,
        loaders: 'style-loader!css-loader?modules!sass-loader'
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ]
  },
  devServer: {
    historyApiFallback: true
  },
  devtool: '#inline-source-map'
})
