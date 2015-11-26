var webpack = require('webpack'),
    path = require('path');

module.exports = {
	target:  "web",
	context: __dirname,
	devtool: false,
	entry:   ["./client/init"],
	output:  {
		path:          path.join(__dirname, "public/client"),
		filename:      "bundle.js",
		chunkFilename: "[name].[id].js",
		publicPath:    "client/"
	},
	plugins: [
		new webpack.DefinePlugin({__CLIENT__: true, __SERVER__: false}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin()
	],
	module:  {
		loaders: [
      {
        include: /\.json$/,
        loaders: ["json-loader"]
      },
      {
        include: /\.js$/,
        exclude: /node_modules/,
        loaders: ["babel-loader?stage=0&optional=runtime&plugins=typecheck"]
      },
      {
        test: /\.css$/,
        loader: "style!css"
      },
      {
        test: /\.less$/,
        loader: 'style!css!less'
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2)$/,
        loader: 'url-loader?limit=8192'
      },
		]
	},
	resolve: {
		modulesDirectories: [
			"react",
			"node_modules",
			"web_modules"
		],
		extensions: ["", ".json", ".js"]
	}
};
