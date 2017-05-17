const SharedVariablesPlugin = require('../../../src/SharedVariablePlugin');
const path = require('path');

module.exports = {
	entry: path.resolve(__dirname, './index.js'),
	plugins: [
		new SharedVariablesPlugin({
			files: [
				{
					source: path.resolve(__dirname, './singleExport.js'),
					dest: path.resolve(__dirname, './scss/singleExport.scss'),
				},
				{
					source: path.resolve(__dirname, './singleExport.js'),
					dest: path.resolve(__dirname, './scss/_singleExport.scss'),
				},
			],
		}),
	],
};