import { IFile } from '../IConfig';
import * as babel from 'babel-core';
import template from '../template';
const { NodeVM, VMScript } = require('vm2');
const mustache = require('mustache');
const pify = require('pify');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

abstract class AbstractParser {
	// Reference to file object
	protected file:IFile = null;
	// Default template for mustache
	private static DEFAULT_TEMPLATE:string = template.SCSS_MAP;

	/**
	 * @param file
	 */
	constructor(file:IFile) {
		this.file = file;
	}

	/**
	 * Flattens compiled object and prepares the object for the mustache template engine
	 * @param obj
	 * @returns {IVarMap}
	 */
	protected mapObject(obj:{[index:string]:any}):IVarMap {
		if(!obj) {
			return;
		}

		const varMap:IVarMap = {};
		const recurse = (currentObject:any, rootKey?:string) => {
			Object.keys(currentObject).forEach((key:string) => {
				if (typeof currentObject[key] === 'string') {
					if(rootKey) {
						if (!varMap[`${rootKey}`]) {
							varMap[`${rootKey}`] = [];
						}
						varMap[rootKey].push({ keyName: key, keyValue: currentObject[key] })
					}
				} else if(typeof currentObject[key] === 'object' && currentObject[key] !== null) {
					recurse(currentObject[key], key);
				}
			});
		};

		recurse(obj);

		return varMap;
	}

	/**
	 * 	protected mapObject(obj:{[index:string]:string}):IVarMap {
		if(!obj) {
			return;
		}

		for (const key in obj) {
			if (typeof obj[key] === "object" && obj[key] !== null) {
				this._rootKey = key;
				this.mapObject(<any> obj[key]);
			} else {
				if (!this._varMap[this._rootKey]) {
					this._varMap[this._rootKey] = [];
				}
				this._varMap[this._rootKey].push({ keyName: key, keyValue: obj[key] });
			}
		}

		return this._varMap;
	}
	 */

	/**
	 * Transforms the source and then runs it
	 * @param source
	 * @returns {Object}
	 */
	protected evaluateSource(source:string):{[x:string]:string} {
		source = this.transformSource(source);
		return this.runSource(source);
	}

	/**
	 * Transforms the source to ES2015
	 * @param source
	 * @returns {string}
	 */
	private transformSource(source:string):string {
		// Transform source to es5
		return babel.transform(source, {
			ast: false,
			presets: [ 'es2015' ],
		}).code;
	}

	/**
	 * The source code is evaluated through the VM2 (sandbox) module
	 * @param source
	 * @returns {Object}
	 */
	private runSource(source:string):{[x:string]:string} {
		// Spawn a new vm
		const vm = new NodeVM();
		let vmScript = source;
		let compiledSource = null;

		try {
			vmScript = new VMScript(source);
		} catch (error) {
			console.error('Failed to compile script.');
			throw error;
		}

		try {
			compiledSource = vm.run(vmScript);
		} catch (error) {
			console.error('Failed to execute script.');
			throw error;
		}

		return compiledSource;
	}

	/**
	 * Returns the fileName
	 * @param filePath
	 * @returns {undefined|string}
	 */
	private getFileName(filePath:string):string {
		return filePath.split(/\//).pop();
	}

	/**
	 * Read mustache template file
	 * @returns {Promise<any>}
	 */
	private async readTemplate():Promise<any> {
		const template = !this.file.template ? AbstractParser.DEFAULT_TEMPLATE : this.file.template;
		return pify(fs.readFile)(template, 'utf-8');
	}

	/**
	 * Write mustache template file
	 * @param templateData
	 * @returns {Promise<any>}
	 */
	private async writeTemplate(templateData:string):Promise<any> {
		const fileToWrite:()=>Promise<any> = () => pify(fs.writeFile)(this.file.dest, templateData, 'utf8');

		if (!this.file.disableDirectoryCreation) {
			await pify(mkdirp)(path.dirname(this.file.dest));
		}

		return fileToWrite();
	}

	/**
	 * Creation of mustache template
	 * @param jsObject
	 * @returns {Promise<void>}
	 */
	protected async createTemplate(jsObject:{[x:string]:string}):Promise<any> {
		const data = this.mapObject(jsObject);

		if (data) {
			const template = await this.readTemplate();
			const dataKeys = Object.keys(data);

			let processedTemplate:string = '';

			dataKeys.forEach((key, index) => {
				// Replace key with map-name/filename if exists (when doing a export default { ... })
				if (dataKeys.length === 1) {
					const keyCopy = key;
					key = this.file.mapName ? this.file.mapName : this.getFileName(this.file.dest)
						.split('.')[0].replace(/^_/, '');
					// Create a new key and content with the new key name, remove the old key from object
					if (data.hasOwnProperty(keyCopy)) {
						data[key] = data[keyCopy];
						delete data[keyCopy];
					}
				}

				processedTemplate += template.replace(/__rootKey__/g, key);
				// Only add two newlines when we are not at EOF
				processedTemplate += (index + 1) === dataKeys.length ? "\n" : "\n\n";
			});

			await this.writeTemplate(mustache.render(processedTemplate, data));
		}
	}

	/**
	 * Abstract implementation of run
	 */
	abstract async run():Promise<any>;
}

interface IVarMap {
	[index:string]:Array<{keyName:string;keyValue:string}>;
}

export default AbstractParser;