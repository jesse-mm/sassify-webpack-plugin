import path = require('path');

const template = {
	SCSS_MAP: path.resolve(__dirname, './parser/template/scss-map.mustache'),
	SCSS_VAR: path.resolve(__dirname, './parser/template/scss-vars.mustache'),
};

export default template;