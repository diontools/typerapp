import * as webpack from 'webpack'
import * as path from 'path'
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'

const distDir = path.resolve(__dirname, 'dist')

const config: webpack.Configuration = {
  entry: './sample/index.tsx',
  output: {
    path: distDir,
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [
      '.tsx',
      '.ts',
      '.js'
      ],
      plugins: [new TsconfigPathsPlugin()],
  },
  plugins: [
    new HtmlWebpackPlugin(),
  ],
  devServer: {
    contentBase: distDir,
    compress: true,
    port: 9000,
  }
}

module.exports = config;