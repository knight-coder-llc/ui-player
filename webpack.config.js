const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack'); //to access built-in plugins

module.exports = {
    entry: ["@babel/polyfill",path.resolve(__dirname, './src/index.js')],
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'app.js'
    },
    mode:'development',
    devtool: 'inline-source-map',
    devServer: {
         before(app) {
            // ========================================================
            // use proper headers for SharedArrayBuffer on Firefox
            // see https://github.com/ffmpegwasm/ffmpeg.wasm/issues/102
            // ========================================================
            app.use((req, res, next) => {
                res.header('Cross-Origin-Opener-Policy', 'same-origin');
                res.header('Cross-Origin-Embedder-Policy', 'require-corp');
                next();
            });
        },
        contentBase: path.join(__dirname, './build'),
        compress: true,
        port: 3000,
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|eot|svg|ttf|woff|mov|mp4)$/i,
                loader: 'file-loader',
                options: {
                    outputPath: 'images',
                },
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.(s[ac]ss|css)$/i,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({template: path.resolve(__dirname + '/src/index.html')}),
        new Dotenv(),
    ]
}