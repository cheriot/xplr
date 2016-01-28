var webpack = require('webpack'),
    path = require('path'),
    ExtractTextPlugin = require("extract-text-webpack-plugin");

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
    new webpack.DefinePlugin({
      'GA_TRACKING_CODE': JSON.stringify(process.env.GA_TRACKING_CODE)
    }),
    new ExtractTextPlugin("bundle.css")
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
        loaders: ["babel-loader?stage=0&optional=runtime"]
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
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
