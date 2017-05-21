const argv = require('yargs').argv;
const { resolve, join } = require('path');
const _ = require('lodash');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appConfig = require('./config/main');
const appConfigDev = require('./config/dev');
const appConfigProduction = require('./config/prod');

const ENV = argv.env || 'dev';

function composeConfig(env) {
  if (env === 'dev') {
    return _.merge({}, appConfig, appConfigDev);
  }

  if (env === 'production') {
    return _.merge({}, appConfig, appConfigProduction);
  }
  return _.merge({}, appConfig, appConfigDev);
}

module.exports = (env) => {
  const production = env === 'production';
  const test = env === 'test';
  const plugins = [];

  if (production) {
    plugins.push(new HtmlWebpackPlugin({ template: '../index.html' }));
  }

  const chooseLoader = loader => (test ? 'null-loader' : loader);
  const API_URL_LOCATION = production ? '': '';

  return {
    entry: [
      resolve(__dirname, 'src/index')
    ],
    resolve: {
      alias: {
        origin: resolve(__dirname, 'src')
      }
    },
    target: 'web',
    output: {
      filename: 'bundle.js',
      path: resolve(__dirname, 'dist'),
      publicPath: production ? './' : '/'
    },
    context: resolve(__dirname, 'src'),
    devtool: production ? 'source-map' : 'inline-source-map',
    plugins: plugins.concat([
      new webpack.DefinePlugin({
        __API_URL__: JSON.stringify(process.env.API_URL || API_URL_LOCATION + ''),
        __APP_CONFIG__: JSON.stringify(composeConfig(ENV))
      }),
      new ExtractTextPlugin({
        filename: 'styles.[contenthash].css',
        disable: !production
      }),
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
      }),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.LoaderOptionsPlugin({
        options: {
          eslint: {
            configFile: resolve(__dirname, '.eslintrc')
          }
        }
      })
    ]),
    module: {
      loaders: [
        {
          enforce:'pre',
          test: /\.js$/,
          exclude: /node_modules/,
          use: ['babel-loader', 'eslint-loader']
        },
        {
          test: /(\.css)$/,
          use: chooseLoader(ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' }))
        },
        {
          test: /\.scss$/,
          use: chooseLoader(ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!sass-loader!resolve-url-loader' }))
        },
        {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          use: chooseLoader('file')
        },
        {
          test: /\.(woff|woff2)$/,
          use: chooseLoader('url?prefix=font/&limit=5000')
        },
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          use: chooseLoader('url?limit=10000&mimetype=application/octet-stream')
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          use: chooseLoader('url?limit=10000&mimetype=image/svg+xml')
        }
      ]
    }
  };
};
