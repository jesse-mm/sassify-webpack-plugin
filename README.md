# Sassify Webpack Plugin [![Build Status](https://img.shields.io/travis/jesse-mm/sassify-webpack-plugin.svg?style=flat-square)](https://travis-ci.org/jesse-mm/sassify-webpack-plugin) [![codecov](https://img.shields.io/codecov/c/github/jesse-mm/sassify-webpack-plugin/master.svg?style=flat-square)](https://codecov.io/gh/jesse-mm/sassify-webpack-plugin) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/jesse-mm/sassify-webpack-plugin/master/LICENSE)
Sassify Webpack is a plugin that hooks into the make process of webpack.
It makes sharing variables between JavaScript/TypeScript and SCSS easy.

## Prerequisite
- [Node 6.x.x](https://nodejs.org/en/download/) or higher
- [NPM 3.x.x](https://nodejs.org/en/download/) or higher
- [Yarn 0.2x.x](https://yarnpkg.com/en/docs/install) or higher

## Installation
```yarn add sassify-webpack-plugin --dev```

## Yarn Commands

```
yarn build	Create a dist folder containing the build
yarn clean	Remove the dist folder with all its contents
yarn test	Run AVA test runner
yarn cover	Get coverage details
```

## Getting started
After installation require the Sassify plugin in your webpack config.

```javascript
// Require the plugin
const SassifyWebpackPlugin = require('sassify-webpack-plugin');
// Dependency
const path = require('path');

module.exports = {
	...
	plugins: [
		new SassifyWebpackPlugin({
			files: [
				{
					source: path.resolve(__dirname, './singleExport.js'),
					dest: path.resolve(__dirname, './scss/singleExport.scss'),
				},
		]}),
	],
};
```

## Configuration Options
Options:
In the files array each object can have the following additional options.

**mapName**
When generating a single export ```export default { ... }``` it's possible to assign a different mapName.
By default Sassify will use the filename (e.g. colors.js -> $colors: ()).

**template**
Sassify is using mustache for rendering templates. By default it uses 'scss-vars.mustache' found in
```node_modules/sassify-webpack-plugin/dist/parser/template```.

Using another template can be done by:
1) Creating your own and use path.resolve to point to it.
2) Or by using predefined templates:

```javascript
const SassifyWebpackPlugin = require('sassify-webpack-plugin');
const template = require('sassify-webpack-plugin/dist/template');

new SassifyWebpackPlugin({
	files: [
		{
			source: path.resolve(__dirname, './singleExport.js'),
			dest: path.resolve(__dirname, './scss/singleExport.scss'),
			template: template.SCSS_VARS,
		},
]})
```

**parser**
It's possible to write a custom parser. Reference
```node_modules/sassify-webpack-plugin/test/fixtures/ExportFileCustom``` for implementation details.