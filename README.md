# js-to-sass-plugin
Makes sharing variables between JavaScript and SCSS easy.
This plugin uses the 'make' hook of webpack.

```
new SharedVariablesPlugin({
	files: [{
		in: './src/data/mediaQueries.js',
		out: './src/asset/style/mediaQueries.scss',
		// Optional defaults to sass-maps
		createVariables: true
	}],
}),
```
