# Sassify Webpack Plugin (BETA) [![Build Status](https://img.shields.io/travis/jesse-mm/sassify-webpack-plugin
.svg?style=flat-square)](https://travis-ci.org/jesse-mm/sassify-webpack-plugin) [![codecov](https://img.shields.io/codecov/c/github/jesse-mm/sassify-webpack-plugin/master.svg?style=flat-square)](https://codecov.io/gh/jesse-mm/sassify-webpack-plugin)
Makes sharing variables between JavaScript/TypeScript and SCSS easy.
Sassify can handle single exports and multi exports; This plugin uses the 'make' hook of webpack.

In your webpack config:
```javascript
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

Options:
In the files object the following configuration options are available:

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
const template = require('sassify-webpack-plugin/template');

new SassifyWebpackPlugin({
	files: [
		{
			source: path.resolve(__dirname, './singleExport.js'),
			dest: path.resolve(__dirname, './scss/singleExport.scss'),
			template: template.vars,
		},
]})
```