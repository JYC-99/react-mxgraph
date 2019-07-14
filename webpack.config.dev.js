const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const commonConfig = require('./webpack.config.common');

module.exports = merge(
  commonConfig,
  {
    mode: 'development',
    entry: [
      './demo/index.tsx' // the entry point of our app
    ],
    devtool: 'cheap-module-eval-source-map',
    module: {
      rules: [
        {
          test: /\.(j|t)sx$/,
          include: /node_modules/,
          use: ['react-hot-loader/webpack'],
        },
        {
          test: /\.js$/,
          use: ["source-map-loader"],
          enforce: "pre"
        },
        {
          test: /\.scss$/,
            use: [
              "style-loader",
              "css-loader",
              "sass-loader"
            ]
        },
      ],
    },
    plugins: [
      new webpack.NamedModulesPlugin(), // prints more readable module names in the browser console on HMR updates
      new HtmlWebpackPlugin({
        template: 'demo/index.html'
      })
    ],
    devServer: {
      open: true,
      overlay: {
        warnings: true,
        errors: true,
      },
    },
  }
);