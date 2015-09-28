var path = require('path'),
    webpack = require('webpack'),
    config = require('./webpack.client.js');

config.devtool = 'eval';

config.entry.unshift(
  'webpack-dev-server/client?http://localhost:5555',
  'webpack/hot/only-dev-server'
);

config.plugins = [
  new webpack.DefinePlugin({__CLIENT__: true, __SERVER__: false}),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
];

config.module = {
  loaders: [
    {include: /\.json$/, loaders: ["json-loader"]},
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: ['react-hot', 'babel-loader?stage=0&optional=runtime&plugins=typecheck']
    }
  ]
}

module.exports = config;
