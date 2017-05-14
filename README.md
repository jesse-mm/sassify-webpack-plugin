# js-to-sass-plugin
Makes sharing variables between JavaScript and SCSS easy.
This plugin uses the 'make' hook of webpack.

```
new SharedVariablesPlugin({
	files: [{
		in: './src/data/example.js',
		out: './src/asset/style/example.scss',
		// Optional defaults to sass-maps
		createVariables: true
	}],
}),
```

IN (example.js)
```javascript
export default {
	BG_COLOR: "green",
	TRANSLATION: "translate(45px, 45px)",
}
```

OUT (example.scss)
```scss
$example: (
	BG_COLOR: "green",
	TRANSLATION: "translate(45px, 45px)",
);
```