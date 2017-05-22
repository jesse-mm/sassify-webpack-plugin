import test from 'ava';
import { IFile } from '../src/IConfig';
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const pify = require('pify');

const fixtures = fs.readdirSync(path.join(__dirname, "fixtures"));

test.cb('Checking generated files against expected output', t => {
	let testIndex = 0;

	fixtures.forEach((fixture:string) => {
		const testDirectory = path.join(__dirname, "fixtures", fixture);
		const configFile = path.join(testDirectory, "webpack.config.js");
		const options = require(configFile);
		const files = options.plugins[0]._config.files;

		options.output = { filename: `./test/fixtures/${fixture}/js/${fixture}.js` };

		webpack(options, (err:Error, stats:any) => {
			if (err) {
				return t.end();
			}
			if (stats.hasErrors()) {
				return t.end();
			}

			if (!options.noExpect) {
				files.forEach((file:IFile) => {
					const expectedFile = readFileOrEmpty(file.dest.replace('scss', 'expected'));
					const generatedFile = readFileOrEmpty(file.dest);

					t.is(expectedFile, generatedFile, 'File contents aren\'t identical.');
				});
			}

			testIndex = testIndex + 1;

			// When all test a ran exit!
			if (testIndex === fixtures.length) {
				t.end();
			}
		});
	});
});

function readFileOrEmpty(path:string) {
	try {
		return fs.readFileSync(path, 'utf-8');
	}
	catch (e) {
		return "";
	}
}