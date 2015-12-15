var path = require('path'),
    webpack = require('webpack'),
    config = require('./webpack.client.js'),
    _ = require('lodash');

config.devtool = 'eval';

config.entry.unshift(
  'webpack-dev-server/client?http://localhost:5555',
  'webpack/hot/only-dev-server'
);

// Remove optimization plugins while in development.
config.plugins = _.filter(config.plugins, function(plugin) {
  var name = plugin.constructor.name;
  console.log('evaluate', plugin.constructor.name, ['DedupePlugin', 'OccurenceOrderPlugin', 'UglifyJsPlugin'].indexOf(name) > -1);
  return ['DedupePlugin', 'OccurenceOrderPlugin', 'UglifyJsPlugin'].indexOf(name) == -1;
});

// Add dev only plugins.
config.plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
]);

// Add react-hot without redefinging every the other loader.
config.module.loaders.push({
  test: /\.js$/,
  exclude: /node_modules/,
  loaders: ['react-hot', "babel-loader?stage=0&optional=runtime&plugins=typecheck"]
});

module.exports = config;
