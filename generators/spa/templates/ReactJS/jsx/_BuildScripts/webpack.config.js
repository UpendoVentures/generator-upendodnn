const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const marked = require('marked');
const fs = require('fs');
module.exports = {
    entry: {
        app: './src/app.jsx'
    },
    output: {
        path: path.resolve('dist/Resources/scripts/'),
        filename: '[name]-bundle.js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.svg'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: 'file-loader',
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: "./<%= moduleName %>.dnn", to: "../../<%= moduleName %>.dnn" },
                { from: "./App_LocalResources", to: "../../App_LocalResources" },
                { from: "./src/Resources", to: "../../Resources", globOptions:{ ignore: ["*.scss"] }},
                { from: "./bin/*.*", globOptions:{ ignore: ["**/Dnn*", "**/DotNetNuke*", "System*", "**/Microsoft*", "**/Newtonsoft*", "*.deps.json"] }, to: "../../", noErrorOnMissing: true},
                { from: "./Providers/**/*.*", to: "../../" }
            ],
        }),
        new HtmlWebpackPlugin({
            inject: false,
            environment: process.env.NODE_ENV,
            template: path.resolve("./src/View.html"),
            filename: "../../View.html"
        }),
        new HtmlWebpackPlugin({
            inject: false,
            environment: process.env.NODE_ENV,
            template: path.resolve("./src/Edit.html"),
            filename: "../../Edit.html"
        }),
        new HtmlWebpackPlugin({
            inject: false,
            environment: process.env.NODE_ENV,
            template: path.resolve("./src/Settings.html"),
            filename: "../../Settings.html"
        }),
        new HtmlWebpackPlugin({
            inject: false,
            title: "License",
            template: path.resolve("./src/_templates/Markdown.html"),
            filename: "../../License.txt",
            bodyHTML: marked.marked(fs.readFileSync(path.resolve("./src/License.md"), "utf8"))
        }),
        new HtmlWebpackPlugin({
            inject: false,
            title: "Release Notes",
            template: path.resolve("./src/_templates/Markdown.html"),
            filename: "../../ReleaseNotes.txt",
            bodyHTML: marked.marked(fs.readFileSync(path.resolve("./src/ReleaseNotes.md"), "utf8"))
        })
    ],
};