import JsParser from 'parser/parser/JsParser';
const path = require('path');
const pify = require('pify');
import FileType from 'parser/enum/FileType';
import TsParser from 'parser/parser/TsParser';
import IParser from 'parser/parser/IParser';

abstract class AbstractParser {
	protected filePath:string;
	protected type:FileType;

	constructor(filePath:string, type:FileType) {
		this.filePath = filePath;
		this.type = type;
	}

	getParser() : IParser {
		let parser = null;

		switch (this.type) {
			case FileType.JS: {
				parser = new JsParser();
				break;
			}
			case FileType.TS: {
				parser = new TsParser();
				break;
			}
			default: {
				throw new Error(`
				[AbstractParser] Unknown type ${this.type}. \n
				Available Parse Types: ${Object.keys(FileType).map(type => type.toLowerCase()).join(',')}.`
				);
			}
		}

		return parser;
	}
}

export default AbstractParser;