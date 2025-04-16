const path = require('path');

module.exports = {
	module: {
		rules: [
			{
				test: /\.(js|jsx|ts|tsx)$/,
				exclude: /node_modules/,
				use: 'babel-loader',
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.jsx'],
	},
	output: {
		filename: 'index-bundle.js', // output bundle file name
		path: path.resolve(__dirname, '../static/js'), // path to our Django static directory
	},
	devtool: 'eval-source-map',
};
