'use strict';
const path = require('path');
const pify = require('pify');
const fs = require('fs');
const mkdirp = require('mkdirp');
import { IConfig, IFile } from './IConfig';
import { Stats } from 'fs';
import ParserFactory from './parser/ParserFactory';
import IParser from './parser/parsers/IParser';

class SharedVariablesPlugin {
	// Stored configuration
	private _config:IConfig;

	/**
	 * Setup Sassify Webpack Plugin
	 * @param config
	 */
	constructor(config:IConfig) {
		this._config = config;

		// Pre-process incoming files
		this._config.files.map(file => {
			return Object.assign(file, {
				mtime: null,
			});
		});
	}

	/**
	 * Apply method is called by webpack
	 * @param compiler
	 */
	public apply(compiler:any) {
		// Listen to the make state of the compiler
		compiler.plugin('make', async (compilation:any, callback:() => void) => {
			const sourceFiles = await (this.getSourceFilesToProcess());
			await this.processFiles(sourceFiles);
			callback();
		});
	}

	/**
	 * Returns files to be processed from JS to SCSS equivalent.
	 * @returns {Promise.<Array>}
	 */
	private async getSourceFilesToProcess() {
		const files:Array<IFile> = [];

		for (let i = 0; i < this._config.files.length; i++) {
			const file = this._config.files[i];
			const mtime = await this.getFileModificationTime(file);

			if (file.mtime !== mtime) {
				file.mtime = mtime;
				files.push(file);
			}
		}

		return files;
	}

	/**
	 * Returns the modified time of source file
	 * @param file
	 * @returns {Promise<T>}
	 */
	private getFileModificationTime(file:IFile) {
		return pify(fs.stat)(path.resolve(file.source))
			.then((statResult:Stats) => {
				return statResult.mtime.getTime();
			}).catch((statError:Error) => {
				throw statError;
			});
	}

	/**
	 * Returns the extension of a file
	 * @param filePath
	 * @returns {string}
	 */
	private getFileExtension(filePath:string):string {
		return filePath.split(/\./g).pop().toUpperCase();
	}

	/**
	 * Process files and runs their assigned parser
	 * @param files
	 * @returns {Promise<void>}
	 */
	private async processFiles(files:Array<IFile>) {
		let parsers:Array<IParser> = new Array(files.length);

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const fileExtension = this.getFileExtension(file.source);

			if (file.parser) {
				console.log(`[Sassify] Using custom parser for ${fileExtension}`);
				if (typeof file.parser === 'function') {
					parsers[i] = new (<any> file.parser(file));
				} else if (typeof (<any> file.parser).default === 'function') {
					parsers[i] = new (<any> file.parser).default(file);
				} else {
					throw new Error('[Sassify] Couldn\'t new the parser.');
				}
			} else {
				parsers[i] = new ParserFactory(file).parser;
			}

			await parsers[i].run();
			parsers = [];
		}
	}

	/**
	 * Little helper function for checking if passed parameter is an array
	 * @param a
	 * @returns {boolean}
	 */
	private isArray = function (a:any) {
		return (!!a) && (a.constructor === Array);
	};

}

module.exports = SharedVariablesPlugin;