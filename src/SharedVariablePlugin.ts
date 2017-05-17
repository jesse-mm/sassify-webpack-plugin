'use strict';
const path = require('path');
const pify = require('pify');
const fs = require('fs');
const mkdirp = require('mkdirp');
import { IConfig, IFile } from 'IConfig';
import { Stats } from 'fs';

class SharedVariablesPlugin {
	private _debug = false;
	private _files:Array<IFile>;
	private _forceWrite:boolean;

	constructor(config:IConfig) {
		// Pre-process incoming files
		this._files = config.files.map(file => {
			return Object.assign(file, {
				mtime: null,
			});
		});

		this._forceWrite = config.forceWrite;
		this._debug = config.debug;
	}

	/**
	 * Apply method is called by webpack
	 * @param compiler
	 */
	apply(compiler:any) {
		// Listen to the make state of the compiler
		compiler.plugin('make', (compilation:any, callback:()=>void) => {
			this.getSourceFilesToProcess()
				.then((files:Array<IFile>) => this.createOutFiles(files.filter((file:IFile) => !!file)))
				.then(() => callback());
		});
	}

	/**
	 * Returns files to be processed from JS to SCSS equivalent.
	 * @returns {Promise.<Array>}
	 */
	private getSourceFilesToProcess() : any {
		const promises = new Array(this._files.length);

		for (let i = 0; i < this._files.length; i++) {
			const file = this._files[i];

			promises[i] = this.statSourceFile(file).then((mtime:string) => {
				if( file.mtime !== mtime) {
					file.mtime = mtime;
					return file;
				}
			});
		}

		return Promise.all<IFile>(promises);
	}

	/**
	 * Stats the in file
	 * @param file
	 */
	statSourceFile(file:IFile) {
		return pify(fs.stat)(path.resolve(file.source))
			.then((statResult:Stats) => {
				console.log(statResult);
				return statResult.mtime.getTime();
			}).catch((statError:Error) => {
				throw statError;
			});
	}

	/**
	 * Parses and evaluates the content that was read
	 * @param fileData
	 * @returns {*}
	 */
	parseSourceFile(fileData:string) {
		// Remove tabs, split on newlines
		let lines = fileData.replace(/\t/, '').split(/\n/);
		// Remove first line and last line of the file
		lines.splice(0,1);
		lines.splice(-1);
		// Join remaining lines
		let lineResult = lines.join('');

		// Check if lines end with a bracket (When user saved without empty line on EOF)
		if (lineResult[lines.length - 1] === '}') {
			lineResult = `{${lineResult}`;
		} else {
			lineResult = `{${lineResult}}`;
		}

		let compiledSource = null;

		try {
			// Danger danger high voltage (Compile into object)
			compiledSource = eval(`'use strict'; const compile = ${lineResult}; compile`);
		}
		catch(error) {
			if (this._debug) {
				console.error(error);
			}
		}

		return compiledSource;
	}

	/**
	 * Generates source code for scss file based on compiledSource
	 * @param compiledSource
	 * @param fileInName
	 * @param fileOutName
	 * @returns {string}
	 */
	generateDestinationFile(compiledSource:{[index:string]:string}, fileInName:string, fileOutName:string) {
		if( compiledSource === null || typeof compiledSource !== 'object') {
			console.error(`[${fileInName}] Cannot generate outFile. Something seems wrong with the compiled source...`);
			return;
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
	createOutFiles(files:Array<IFile>) {
		if( files.length === 0) {
			return Promise.resolve();
		}

		const promises = new Array(files.length);
		const getFileName = (fileName:string) => fileName.split(/\//).pop();

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			promises[i] = pify(fs.readFile)(path.resolve(file.source), 'utf-8')
				.then((fileData:string) => this.parseSourceFile(fileData))
				.then((compiledJs:{[index:string]:string}) => this.generateDestinationFile(
					compiledJs,
					getFileName(file.source),
					getFileName(file.dest))
				)
				.then((scssSource:string) => this.writeDestinationFile(scssSource, file.dest))
				.catch((error:Error) => console.error(error));
		}

		return Promise.all(promises);
	}

	/**
	 * Writes the SCSS file
	 * @param scssSource
	 * @param outFile
	 */
	writeDestinationFile(scssSource:string, outFile:string) {
		const fileToWrite:()=>Promise<any> = () => pify(fs.writeFile)(path.resolve(outFile), scssSource, 'utf8');

		if (this._forceWrite) {
			return pify(mkdirp)(path.dirname(path.resolve(outFile)))
				.then(<any> fileToWrite());
		}

		return fileToWrite();
	}
}

module.exports = SharedVariablesPlugin;