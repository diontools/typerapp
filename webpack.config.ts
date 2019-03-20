import { Configuration } from "webpack";

//import * as webpack from 'webpack'
const webpack = require('webpack')
const path = require('path')
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')

const distDir = path.resolve(__dirname, 'sample-dist')

const config: Configuration = {
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
    new HtmlWebpackPlugin({
      template: './sample/index.html',
      inlineSource: '.(js|css)$', // embed all javascript and css inline
    }),
    new HtmlWebpackInlineSourcePlugin(),
  ],
  devServer: {
    contentBase: distDir,
    compress: true,
    port: 9000,
    historyApiFallback: true,
  }
}

module.exports = config;