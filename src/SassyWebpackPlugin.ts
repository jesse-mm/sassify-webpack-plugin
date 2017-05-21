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
	private _config:IConfig;

	constructor(config:IConfig) {
		this._config = config;

		// Pre-process incoming files
		this._config.files.map(file => {
			return Object.assign(file, {
				mtime: null,
			});
		});

		// Checks the custom parser if all valid
		this.customParserChecks();
	}

	/**
	 * Apply method is called by webpack
	 * @param compiler
	 */
	apply(compiler:any) {
		// Listen to the make state of the compiler
		compiler.plugin('make', async (compilation:any, callback:()=>void) => {
			const sourceFiles = await (this.getSourceFilesToProcess());
			await this.processFiles(sourceFiles);
			callback();
		});
	}

	private isArray = function(a:any) {
		return (!!a) && (a.constructor === Array);
	};

	private customParserChecks() : void {
		// Simple helper function for checking string
		const isString = ((fileExtension:string) => typeof fileExtension === 'string');

		// Pre-process customParser
		if (this._config.customParser) {
			if (typeof this._config.customParser.parser !== 'function') {
				throw new Error('[SharedVariablesPlugin] No valid customParser supply a method.');
			}
			if (!this._config.customParser.fileExtension) {
				throw new Error('[SharedVariablesPlugin] customParser object lacks a fileExtension property.')
			} else {
				const fileExtension = this._config.customParser.fileExtension;

				if (isString(<string> fileExtension)) {
					this._config.customParser.fileExtension = [(<string> fileExtension).toUpperCase()];
				} else if (this.isArray(fileExtension)) {
					(<Array<string>> fileExtension).forEach((extension: string) => {
						if (!isString(extension)) {
							throw new Error('[SharedVariablesPlugin] No valid file extension in Array.');
						}
					});

					this._config.customParser.fileExtension = (<Array<string>> fileExtension)
						.map((extension: string) => extension.toUpperCase());
				} else {
					throw new Error(`[SharedVariablesPlugin] customParser has no valid fileExtension must be one of
					Array or String.`);
				}
			}
		}
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

			if( file.mtime !== mtime) {
				file.mtime = mtime;
				files.push(file);
			}
		}

		return files;
	}

	/**
	 * Stats the in file
	 * @param file
	 */
	private getFileModificationTime(file:IFile) {
		return pify(fs.stat)(path.resolve(file.source))
			.then((statResult:Stats) => {
				return statResult.mtime.getTime();
			}).catch((statError:Error) => {
				throw statError;
			});
	}

	private getFileExtension(filePath:string) : string {
		return filePath.split(/\./g).pop().toUpperCase();
	}

	private async processFiles(files:Array<IFile>) {
		const parsers:Array<IParser> = new Array(files.length);

		const customParser = this._config.customParser;

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const fileExtension = this.getFileExtension(file.source);

			if (customParser && customParser.fileExtension.indexOf(fileExtension) > -1) {
				console.log(`[Sassify] Using custom parser for ${fileExtension}`);
				parsers[i] = this._config.customParser.parser;
			} else {
				parsers[i] = new ParserFactory(file).parser;
			}

			await parsers[i].run();
		}
	}

}

module.exports = SharedVariablesPlugin;