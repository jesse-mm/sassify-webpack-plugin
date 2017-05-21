import AbstractParser from '../AbstractParser';
import IParser from './IParser';
import { IFile } from '../../IConfig';
const pify = require('pify');
const fs = require('fs');

export default class JsParser extends AbstractParser implements IParser {

	/**
	 * Pass file to AbstractParser
	 * @param file
	 */
	constructor(file: IFile) {
		super(file);
	}

	/**
	 * Run the parser
	 * @returns {Promise<undefined>}
	 */
	public run() : Promise<any> {
		return this.parse();
	}

	/**
	 * Parse JavaScript file
	 * @returns {Promise<void>}
	 */
	private async parse() {
		const fileContent = await pify(fs.readFile)(this.file.source, 'utf-8');
		await this.createTemplate(this.evaluateSource(fileContent));
	}
}