import path = require('path');

const template = {
	SCSS_MAP_QUOTED: path.resolve(__dirname, './parser/template/scss-map-quoted.mustache'),
	SCSS_MAP_UNQUOTED: path.resolve(__dirname, './parser/template/scss-map-unquoted.mustache'),
	SCSS_VAR: path.resolve(__dirname, './parser/template/scss-vars.mustache'),
};

module.exports = template;