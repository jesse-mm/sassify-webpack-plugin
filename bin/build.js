const shelljs = require('shelljs');
const path = require('path');
const chalk = require('chalk');

// Simple build script
((type) => {
	const rootDir = path.resolve(__dirname, '../');

	const build = {
		clean: () => shelljs.rm('-Rf', `${rootDir}/dist/`),
		compile: () => shelljs.exec(`${rootDir}/node_modules/.bin/tsc -p ${rootDir}`),
		create: () => shelljs.mkdir(`${rootDir}/dist/parser/temp`),
		copy: () => shelljs.cp('-R', `${rootDir}/src/parser/template`, `${rootDir}/dist/parser/template`),
		done: () => console.log('> ' + chalk.white.bgGreen.bold(`${type} executed`)),
	};

	switch(type) {
		case 'build': {
			Object.keys(build).forEach(key => build[key]());
			break;
		}
		case 'clean': {
			build.clean();
			build.done();
			break;
		}
		default: {
			Object.keys(build).forEach(key => build[key]());
		}
	}
})(process.argv.slice(2));