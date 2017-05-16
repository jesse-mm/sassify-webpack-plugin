const test = require('ava');
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

const cases = fs.readdirSync(path.join(__dirname, "cases"));

test.cb('Checking generated files against expected output', t => {
	cases.forEach(testCase => {
		const testDirectory = path.join(__dirname, "cases", testCase);
		const configFile = path.join(testDirectory, "webpack.config.js");
		const options = require(configFile);

		options.output = { filename: `./test/cases/${testCase}/js/${testCase}.js` };

		webpack(options, (err, stats) => {
			if(err) return t.end(err);
			if(stats.hasErrors()) return t.end(new Error(stats.toString()));

			const expectedDirectory = path.join(testDirectory, "expected");

			options.plugins[0].files.forEach((file, index) => {
				const expectedFile = readFileOrEmpty(file.out.replace('scss', 'expected'));
				const generatedFile = readFileOrEmpty(file.out);

				t.is(expectedFile, generatedFile, 'File contents aren\'t identical.');
			});

			t.end();
		});
	});
});

function readFileOrEmpty(path) {
	try {
		return fs.readFileSync(path, 'utf-8');
	} catch(e) {
		return "";
	}
}