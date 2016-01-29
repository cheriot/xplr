var path = require('path'),
    webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    config = require('./webpack.client.js'),
    _ = require('lodash');

config.devtool = 'eval';

// Remove hashes from file names so files can be recompiled without needing
// to regenerate everything that links to them (client/index.ejs).
config.output.filename = "dev-bundle-dev.js"
config.plugins = _.filter(config.plugins, function(plugin) {
  const name = plugin.constructor.name;
  return ['ExtractTextPlugin'].indexOf(name) == -1;
});
config.plugins = config.plugins.concat([
  new ExtractTextPlugin('dev-bundle-dev.css')
]);

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
