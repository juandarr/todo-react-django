const path = require('path');
const BundleTracker = require('webpack-bundle-tracker');
const BundleAnalyzerPlugin =
	require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');

const plugins = [
	new BundleTracker({
		// Path where webpack-stats.json will be generated
		// Needs to be accessible by Django
		path: path.resolve(__dirname, '../static/webpack-stats/'), // Example: Put it in a sibling dir
		filename: 'webpack-stats.json' // Standard name
	})
];

// Use env variable ANALYZE=true as prefix when running `npm run dev/build`
if (process.env.ANALYZE) {
	plugins.push(new BundleAnalyzerPlugin());
}

module.exports = (env, argv) => {
	const isProduction = argv.mode === 'production';
	
	return {
		mode: isProduction ? 'production' : 'development', // Set mode based on NODE_ENV
		entry: './src/index.tsx',
		plugins: plugins,
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
		devtool: isProduction ? 'source-map' : 'eval-source-map', // Use 'source-map' for prod, 'eval-source-map' for dev
		optimization: {
			minimize: isProduction, // Ensure minification is enabled in production
			minimizer: isProduction
					? [
							new TerserPlugin({
								terserOptions: {
									compress: {
										drop_console: true //ensures console statements are dropped
									}
								}
							})
						]
					: [], // No minimizers in development
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
};
