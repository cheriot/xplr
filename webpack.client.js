var webpack = require('webpack'),
    path = require('path'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    PathRewriterPlugin = require('webpack-path-rewriter');

module.exports = {
	target:  "web",
	context: __dirname,
	devtool: false,
	entry:   ["./client/init"],
	output:  {
		path:          path.join(__dirname, "public/client"),
		publicPath:    `${process.env.CONTENT_DOMAIN}/client/`,
		filename:      "[name]-bundle-[hash].js"
	},
	plugins: [
    new webpack.DefinePlugin({
      'GA_TRACKING_CODE': JSON.stringify(process.env.GA_TRACKING_CODE)
    }),
    new ExtractTextPlugin("[name]-bundle-[contenthash].css", {allChunks: true}),
    new PathRewriterPlugin()
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
        test: /\.(png|jpg)$/,
        loader: "url-loader?limit=100000&name=[name]-[hash].[ext]"
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2)$/,
        loader: 'url-loader?limit=8192&name=[name]-[hash].[ext]'
      },
      {
        test: /\.ejs$/,
        loader: PathRewriterPlugin.rewriteAndEmit({
          // Add references to js and css files that have generated filenames.
          // This will be picked up and rendered by the server to inject the isomorphically
          // rendered content keep the filename predictable.
          name: '[name].ejs'
          // In theory, this could drop the file somewhere that's not public.
        })
      }
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
