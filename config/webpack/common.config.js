const path = require('path');

const webpack = require('webpack');

const envPlugin = new webpack.EnvironmentPlugin({
  NODE_ENV: 'development'
});

module.exports = {
  entry: [path.resolve(process.cwd(), 'src/index.tsx')],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        enforce: 'pre',
        loader: 'tslint-loader',
        options: {
          failOnHint: true,
          typeCheck: false, // Enable this and fix occasionally -- they too long to do every time
          fix: false
        }
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      }
    ]
  },
  plugins: [envPlugin],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  }
};
