const test = require('ava');
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

const cases = fs.readdirSync(path.join(__dirname, "cases"));

test.cb('Checking generated files against expected output', t => {
	let testIndex = 0;

	cases.forEach(testCase => {
		const testDirectory = path.join(__dirname, "cases", testCase);
		const configFile = path.join(testDirectory, "webpack.config.js");
		const options = require(configFile);
		const files = options.plugins[0]._config.files;

		options.output = { filename: `./test/cases/${testCase}/js/${testCase}.js` };

		webpack(options, (err, stats) => {
			if (err) {
				return t.end(err);
			}
			if (stats.hasErrors()) {
				return t.end(new Error(stats.toString()));
			}

			if (!options.noExpect) {
				files.forEach((file) => {
					const expectedFile = readFileOrEmpty(file.dest.replace('scss', 'expected'));
					const generatedFile = readFileOrEmpty(file.dest);

					t.is(expectedFile, generatedFile, 'File contents aren\'t identical.');
				});
			}

			testIndex = testIndex + 1;

			// When all test a ran exit!
			if (testIndex === cases.length) {
				t.end();
			}
		});
	});
});

function readFileOrEmpty(path) {
	try {
		return fs.readFileSync(path, 'utf-8');
	}
	catch (e) {
		return "";
	}
}