import { IFile } from '../../../src/IConfig';
import IParser from '../../../src/parser/parsers/IParser';

class CustomParser implements IParser {
	private _file:IFile;

	constructor(file:IFile) {
		this._file = file;
	}

	/**
	 * Run the parser (Called by SassifyPlugin)
	 * @returns {Promise<undefined>}
	 */
	public async run() : Promise<any> {
		await this.readSource();
		await this.compile();
		await this.writeScss();
	}

	/**
	 * Example method
	 * @returns {Promise<void>}
	 */
	private async readSource() {
		console.log('Reading', this._file.source);
		return new Promise((resolve:()=>void) => {
			setTimeout(() => {
				console.log('Read source');
				resolve();
			}, 10);
		});
	}

	/**
	 * Example method
	 * @returns {Promise<void>}
	 */
	private async compile() {
		console.log('Compiling', this._file.source);
		return new Promise((resolve:()=>void) => {
			setTimeout(() => {
				console.log('Compiled source');
				resolve();
			}, 10);
		});
	}

	/**
	 * Example method
	 * @returns {Promise<void>}
	 */
	private async writeScss() {
		console.log('Writing');
		return new Promise((resolve:()=>void) => {
			setTimeout(() => {
				console.log('Written file');
				resolve();
			}, 10);
		});
	}
}

export default CustomParser;