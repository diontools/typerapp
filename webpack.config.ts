import * as webpack from 'webpack'
import * as path from 'path'
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'

const distDir = path.resolve(__dirname, 'sample-dist')

const config: webpack.Configuration = {
  entry: './sample/index.tsx',
  devtool: 'source-map',
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
    plugins: [new TsconfigPathsPlugin({ configFile: './sample/tsconfig.json' })],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './sample/index.html' }),
  ],
  devServer: {
    contentBase: distDir,
    compress: true,
    port: 9000,
    historyApiFallback: true,
  }
}

module.exports = config;