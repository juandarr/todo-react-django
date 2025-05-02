const path = require('path');
const BundleTracker = require('webpack-bundle-tracker');
const BundleAnalyzerPlugin =
	require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
	entry: './src/index.tsx',
	plugins: [
		new BundleTracker({
			// Path where webpack-stats.json will be generated
			// Needs to be accessible by Django
			path: path.resolve(__dirname, '../static/webpack-stats/'), // Example: Put it in a sibling dir
			filename: 'webpack-stats.json' // Standard name
		}),
		new BundleAnalyzerPlugin() // Add this line
	],
	module: {
		rules: [
			{
				test: /\.(js|jsx|ts|tsx)$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			}
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.jsx']
	},
	output: {
		filename: '[name].[contenthash].js', // output bundle file name
		path: path.resolve(__dirname, '../static/js'), // path to our Django static directory
		clean: true
	},
	devtool: 'eval-source-map',
	optimization: {
		moduleIds: 'deterministic',
		runtimeChunk: 'single',
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/](?!react-day-picker|@tiptap|prosemirror-*)/, // Exclude react-day-picker and tiptap
					name: 'vendors',
					chunks: 'all'
				},
				reactDayPicker: {
					test: /[\\/]node_modules[\\/]react-day-picker/,
					name: 'react-day-picker',
					chunks: 'all'
				},
				tiptap: {
					test: /[\\/]node_modules[\\/]@tiptap/,
					name: 'tiptap',
					chunks: 'all'
				},
				prosemirror: {
					test: /[\\/]node_modules[\\/]prosemirror-*/,
					name: 'prosemirror',
					chunks: 'all'
				}
			}
		}
	}
};
