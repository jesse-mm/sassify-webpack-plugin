import IParser from 'parser/parsers/IParser';

interface ICustomParser extends IParser {
	constructor(filePath:string):void;
}

export default ICustomParser;