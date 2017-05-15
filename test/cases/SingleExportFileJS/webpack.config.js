const SharedVariablesPlugin = require('../../../src/index');
const path = require('path');

module.exports = {
	entry: path.resolve(__dirname, './index.js'),
	plugins: [
		new SharedVariablesPlugin({
			files: [
				{
					in: path.resolve(__dirname, './singleExport.js'),
					out: path.resolve(__dirname, './scss/singleExport.scss'),
				},
				{
					in: path.resolve(__dirname, './singleExport.js'),
					out: path.resolve(__dirname, './scss/_singleExport.scss'),
				},
			],
		}),
	],
};