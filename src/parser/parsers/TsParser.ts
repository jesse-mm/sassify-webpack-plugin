import AbstractParser from '../AbstractParser';
import IParser from './IParser';
import { IFile } from '../../IConfig';
const pify = require('pify');
const fs = require('fs');
const shell = require('shelljs');
const path = require('path');

export default class TsParser extends AbstractParser implements IParser {

	constructor(file: IFile) {
		super(file);
	}

	public run() : Promise<any> {
		return this.parse();
	}

	/**
	 * Parse TypeScript file
	 * @returns {Promise<void>}
	 */
	private async parse() {
		const outFileName = this.file.source.split(/\//).pop().replace('ts', 'js');

		shell.exec(
			path.resolve(
				__dirname,
				`../../../node_modules/.bin/tsc --target ES2016 ${this.file.source} --outDir ${path.resolve(__dirname, '../temp')}`
			)
		);

		const fileContent = await pify(fs.readFile)(path.resolve(__dirname, `../temp/${outFileName}`), 'utf-8');
		await this.createTemplate(this.evaluateSource(fileContent));
		await pify(fs.unlink)(path.resolve(__dirname, `../temp/${outFileName}`));
	}
}