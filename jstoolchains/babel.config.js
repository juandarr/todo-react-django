// jstoolchains/babel.config.js
const ReactCompilerConfig = {
	target: '19',
};

module.exports = {
	presets: [
		'@babel/preset-env',
		['@babel/preset-react', { runtime: 'automatic' }],
		'@babel/preset-typescript',
	],
	plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]],
};
