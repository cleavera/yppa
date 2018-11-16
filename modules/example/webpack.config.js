const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


module.exports = {
    entry: {
        'main': path.resolve(__dirname, './docs/doc.ts')
    },

    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'index.js'
    },

    devServer: {
        port: 8080,
        historyApiFallback: true
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    'ts-loader',
                    'angular2-template-loader'
                ]

            },
            {
                test: /\.html$/,
                use: 'raw-loader'
            },
            {
                test: /\.(s?)css$/,
                use: [
                    'raw-loader',
                    'sass-loader'
                ]
            }
        ]
    },

    target: 'web',

    resolve: {
        modules: [
            'node_modules'
        ],
        extensions: ['.ts', '.js']
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './docs/index.html',
            inject: 'body'
        }),
        new webpack.ContextReplacementPlugin(
            /\@angular(\\|\/)core(\\|\/)fesm5/,
            path.resolve(__dirname, './src')
        )
    ],

    mode: 'development',
    stats: {
        all: false,
        assets: true,
        chunks: false,
        errors: true,
        errorDetails: true,
        warnings: false
    },

    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    output: {
                        beautify: false,
                        comments: false
                    }
                }
            })
        ]
    }
};
