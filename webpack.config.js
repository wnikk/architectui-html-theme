'use strict';
const Path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const pages = require('./src/pages');
let renderedPages = [];
for (let i = 0; i < pages.length; i++) {
    let page = Object.assign({}, pages[i]);
    renderedPages.push(
        new HtmlWebpackPlugin({
            template: page.template,
            filename: page.output,
            title: page.content.title,
            heading_icon: page.content.heading_icon,
            description: page.content.description,
            inject: 'body',
            minify: false
        })
    );
}

module.exports = (options) => {
    const dest = Path.join(__dirname, 'dist');

    let webpackConfig = {
        mode: options.isProduction ? 'production' : 'development',
        devtool: options.devtool,
        entry: {
            app: './src/app.js',
            main: './src/main.js',
            demo: './src/scripts-init/demo.js',
            toastr: './src/scripts-init/toastr.js',
            scrollbar: './src/scripts-init/scrollbar.js',
            fullcalendar: './src/scripts-init/calendar.js',
            maps: './src/scripts-init/maps.js',
            chart_js: './src/scripts-init/charts/chartjs.js',
        },
        output: {
            path: dest,
            filename: '[name].js',
            clean: true
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].css'
            }),
            new CssMinimizerPlugin(), // minifies only CSS
            new CopyWebpackPlugin({
                patterns: [
                    { from: './src/assets/images', to: './assets/images' }
                ]
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify(options.isProduction ? 'production' : 'development')
                }
            }),
            ...renderedPages
        ],
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.hbs$/,
                    loader: 'handlebars-loader',
                    options: {
                        helperDirs: [
                            Path.join(__dirname, 'src', 'helpers')
                        ],
                        partialDirs: [
                            Path.join(__dirname, 'src', 'layout'),
                            Path.join(__dirname, 'src', 'DemoPages'),
                        ]
                    }
                },
                {
                    test: /\.(scss|css)$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader: 'sass-loader',
                            options: { warnRuleAsWarning: false }
                        }
                    ]
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: 'asset/resource',
                }
            ]
        },
        optimization: {
            minimize: false, // disables JS minification
            runtimeChunk: false,
            splitChunks: false
        }
    };

    if (options.isProduction) {
        webpackConfig.plugins.push(
            new CleanWebpackPlugin({
                verbose: true,
                dry: false
            })
        );
    } else {
        webpackConfig.plugins.push(
            new webpack.HotModuleReplacementPlugin()
        );
        webpackConfig.devServer = {
            port: options.port,
            historyApiFallback: true,
            hot: true,
            static: {
                directory: Path.join(__dirname, 'public'),
            },
            watchFiles: ['public/**/*.*'],
            open: {
                target: ['http://localhost:8080'],
                app: {
                    name: 'google chrome'
                }
            }
        };
    }

    return webpackConfig;
};