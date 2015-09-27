import webpack from "webpack";
import path from "path";

module.exports = {
	target:  "web",
	context: __dirname,
	devtool: false,
	entry:   ["./app/client"],
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
			{include: /\.json$/, loaders: ["json-loader"]},
			{include: /\.js$/, loaders: ["babel-loader?stage=0&optional=runtime&plugins=typecheck"], exclude: /node_modules/}
		]
	},
	resolve: {
		modulesDirectories: [
			"app",
			"node_modules",
			"web_modules"
		],
		extensions: ["", ".json", ".js"]
	}
};
