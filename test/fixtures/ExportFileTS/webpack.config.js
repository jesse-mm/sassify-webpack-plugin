const SassifyWebpackPlugin = require('../../../src/SassifyWebpackPlugin');
const template = require('../../../src/template');
const path = require('path');

module.exports = {
	entry: path.resolve(__dirname, './index.js'),
	plugins: [
		new SassifyWebpackPlugin({
			debug: false,
			files: [
				{
					source: path.resolve(__dirname, './singleExport.ts'),
					dest: path.resolve(__dirname, './scss/singleExport.scss'),
				},
				{
					source: path.resolve(__dirname, './multiExport.ts'),
					dest: path.resolve(__dirname, './scss/multiExport-unquoted.scss'),
				},
				{
					source: path.resolve(__dirname, './multiExport.ts'),
					dest: path.resolve(__dirname, './scss/multiExport-quoted.scss'),
					template: template.SCSS_MAP_QUOTED,
				},
				{
					source: path.resolve(__dirname, './singleExport.ts'),
					dest: path.resolve(__dirname, './scss/singleExport-mapName.scss'),
					mapName: 'globals',
				},
				{
					source: path.resolve(__dirname, './singleExport.ts'),
					dest: path.resolve(__dirname, './scss/singleExport-varsOnly.scss'),
					template: template.SCSS_VAR,
				}
			],
		}),
	],
};