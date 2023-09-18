const path = require('path');

module.exports = {
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				exclude: /node_modules/,
				use: 'ts-loader',
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	output: {
		filename: 'index-bundle.js', // output bundle file name
		path: path.resolve(__dirname, '../static/js'), // path to our Django static directory
	},
	devtool: 'eval-source-map',
};
