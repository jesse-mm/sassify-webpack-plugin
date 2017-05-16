const path = require('path');
const pify = require('pify');
import FileType from './enum/FileType';
import JsParser from './parser/JsParser';
import TsParser from './parser/TsParser';

class AbstractParser {
	constructor(file, type) {
		this.file = file;
		this.type = type;
	}

	getParser() {
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
				[AbstractParser] Unknown type ${type}. \n
				Available Parse Types: ${Object.keys(FileType).map(type => type.toLowerCase().join(','))}.`
				);
			}
		}
	}

	parse() {
		const parser = this.getParser();
		parser.parse();
	}
}

export default AbstractParser;