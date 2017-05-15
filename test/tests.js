const test = require('ava');
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

const cases = fs.readdirSync(path.join(__dirname, "cases"));

test.cb('Compiles ', t => {
	cases.forEach(testCase => {
		const testDirectory = path.join(__dirname, "cases", testCase);
		const configFile = path.join(testDirectory, "webpack.config.js");
		const options = require(configFile);

		options.output = { filename: `./test/cases/${testCase}/js/${testCase}.js` };

		webpack(options, (err, stats) => {
			if(err) return t.end(err);
			if(stats.hasErrors()) return t.end(new Error(stats.toString()));

			const expectedDirectory = path.join(testDirectory, "expected");

			fs.readdirSync(expectedDirectory).forEach(function(file, index) {
				const expectedFile = path.join(expectedDirectory, file);
				const generatedFile = options.plugins[0].files[index];

				t.is(readFileOrEmpty(expectedFile), readFileOrEmpty(generatedFile), 'File contents identical');
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