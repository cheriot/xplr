var path = require('path'),
    webpack = require('webpack'),
    config = require('./webpack.client.js'),
    _ = require('lodash');

config.devtool = 'eval';

config.entry.unshift(
  'webpack-dev-server/client?http://localhost:5555',
  'webpack/hot/only-dev-server'
);

// Add dev only plugins.
config.plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
]);

// Add react-hot without redefinging every the other loader.
// Add to the begining (shift) because babel running before react-hot generates
// strange errors.
config.module.loaders.shift({
  test: /\.js$/,
  exclude: /node_modules/,
  loaders: ['react-hot', "babel-loader?stage=0&optional=runtime"]
});

module.exports = config;
