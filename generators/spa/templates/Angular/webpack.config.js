/* eslint-disable no-undef */
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
module.exports = {
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./src/Resources", to: "Resources" }
      ],
    }),
    new HtmlWebpackPlugin({
        inject: false,
        environment: process.env.NODE_ENV,
        template: path.resolve("./src/View.html"),
        filename: "View.html"
    }),
    new HtmlWebpackPlugin({
        inject: false,
        environment: process.env.NODE_ENV,
        template: path.resolve("./src/Settings.html"),
        filename: "Settings.html"
    })
  ],
};