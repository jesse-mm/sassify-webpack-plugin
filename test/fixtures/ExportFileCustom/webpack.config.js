const SassifyWebpackPlugin = require('../../../src/SassifyWebpackPlugin');
const path = require('path');
const CustomParser = require('./CustomParserExample');

module.exports = {
	entry: path.resolve(__dirname, './index.js'),
	plugins: [
		new SassifyWebpackPlugin({
			debug: false,
			noExpect: true,
			files: [
				{
					parser: CustomParser,
					source: path.resolve(__dirname, './ExampleFile.ext'),
					dest: path.resolve(__dirname, './ExampleFile.ext'),
				},
		]}),
	],
};