'use strict';
const path = require('path');
const fs = require('fs');
const pify = require('pify');
const moment = require('moment');

class SharedVariablesPlugin {
	constructor(config) {
		// Create SASS vars instead of a SASS map
		this.createVariables = !!config.createVariables;
		// Pre-process incoming files
		this.files = config.files.map(file => {
			return Object.assign(file, {
				modificationDate: null,
			});
		});

		this.debug = config.debug;

		// When first make has ran
		this.firstRun = true;
		// Generate new out file when in file is older then > 1000
		this.refreshOutFileTime = 1000;
	}

	/**
	 * Apply method is called by webpack
	 * @param compiler
	 */
	apply(compiler) {
		// Listen to the make state of the compiler
		compiler.plugin('make', (compilation, callback) => {
			this.setInFilesNewModificationDate()
				.then(() => this.getInFilesToProcess())
				.then(files => this.createOutFiles(files))
				.then(() => callback());
		});
	}

	/**
	 * Stats in files and checks there modification date
	 * @param files
	 * @returns {Promise.<*>}
	 */
	setInFilesNewModificationDate() {
		const promises = new Array(this.files.length);

		for (let i = 0; i < this.files.length; i++) {
			const file = this.files[i];
			promises[i] = this.statInFile(file);
		}

		return Promise.all(promises);
	}

	/**
	 * Returns files to be processed from JS to SCSS equivalent.
	 * @returns {Promise.<Array>}
	 */
	getInFilesToProcess() {
		const filesToProcess = [];

		for (let i = 0; i < this.files.length; i++) {
			const file = this.files[i];

			if (this.firstRun) {
				filesToProcess.push(file);
			} else {
				// Refresh out file when passed time is smaller then refreshOutFileTime
				if (moment.utc().diff(moment.utc(file.modificationDate)) < this.refreshOutFileTime) {
					filesToProcess.push(file);
				}
			}
		}

		this.firstRun = false;

		return Promise.resolve(filesToProcess);
	}

	/**
	 * Stats the in file
	 * @param file
	 */
	statInFile(file) {
		return pify(fs.stat)(path.resolve(file.in))
			.then((statResult) => {
				file.modificationDate = statResult.mtime;
				return file;
			})
			.catch(error => console.error(error));
	}

	/**
	 * Parses and evaluates the content that was read
	 * @param fileData
	 * @returns {*}
	 */
	parseInFile(fileData) {
		// Remove tabs, split on newlines
		let lines = fileData.replace(/\t/, '').split(/\n/);
		// Remove first line and last line of the file
		lines.splice(0,1);
		lines.splice(-1);
		// Join remaining lines
		lines = lines.join('');

		// Check if lines end with a bracket (When user saved without empty line on EOF)
		if (lines[lines.length - 1] === '}') {
			lines = `{${lines}`;
		} else {
			lines = `{${lines}}`;
		}

		let compiledSource = null;

		try {
			// Danger danger high voltage (Compile into object)
			compiledSource = eval(`'use strict'; const compile = ${lines}; compile`);
		}
		catch(error) {
			if (this.debug) {
				console.error(error);
			}
		}

		return compiledSource;
	}

	/**
	 * Generates source code for scss file based on compiledSource
	 * @param compiledSource
	 * @returns {string}
	 */
	generateScss(compiledSource, fileInName, fileOutName) {
		if( compiledSource === null || typeof compiledSource !== 'object') {
			console.error(`[${fileInName}] Cannot generate outFile. Something seems wrong with the compiled source...`);
			return;
		}

		if(this.createVariables) {
			return Object.keys(compiledSource).map(key => `$${key}: ${compiledSource[key]};`).join("\n");
		}

		const mapName = fileOutName.split(/\./).shift();

		const prepend = `$${mapName}: (\n`;
		const content = Object.keys(compiledSource)
			.map(key => `\t${key.toUpperCase()}: '${compiledSource[key]}',`)
			.join("\n");
		const append = '\n);';

		return `${prepend}${content}${append}`;
	}

	/**
	 * Iterates through all files and processes them to create the out files
	 * @param files
	 * @returns {Promise.<*>}
	 */
	createOutFiles(files) {
		const promises = new Array(files.length);
		const getFileName = (fileName) => fileName.split(/\//).pop();

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			promises[i] = pify(fs.readFile)(path.resolve(file.in), 'utf-8')
				.then((fileData) => this.parseInFile(fileData))
				.then(compiledJs => this.generateScss(compiledJs, getFileName(file.in), getFileName(file.out)))
				.then(scssSource => this.writeOutFile(scssSource, file.out))
				.catch(error => console.error(error));
		}

		return Promise.all(promises);
	}

	/**
	 * Writes the SCSS file
	 * @param scssSource
	 * @param outFile
	 */
	writeOutFile(scssSource, outFile) {
		return pify(fs.writeFile)(path.resolve(outFile), scssSource, 'utf8');
	}
}

module.exports = SharedVariablesPlugin;
