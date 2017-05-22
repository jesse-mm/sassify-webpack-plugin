import { IFile } from '../IConfig';
import FileType from './enum/FileType';
import IParser from './parsers/IParser';
import JsParser from './parsers/JsParser';
import TsParser from './parsers/TsParser';

class ParserFactory {
	private _file:IFile;

	constructor(file:IFile) {
		this._file = file;
	}

	/**
	 * Get specified parser
	 * @returns FileType
	 */
	private getParserType() : FileType {
		const fileExtension = this._file.source.split('.').pop().toUpperCase();
		return FileType[fileExtension as keyof typeof FileType];
	}

	/**
	 * Get available parser
	 * @returns {null}
	 */
	public get parser() : IParser {
		const type = this.getParserType();
		let parser = null;

		switch (type) {
			case FileType.JS: {
				parser = new JsParser(this._file);
				break;
			}
			case FileType.TS: {
				parser = new TsParser(this._file);
				break;
			}
			default: {
				throw new Error(`
				[Parser] Unknown type ${type}. \n
				Available Parse Types: ${Object.keys(FileType).map(type => type.toLowerCase()).join(',')}.`
				);
			}
		}

		return parser;
	}
}

export default ParserFactory;