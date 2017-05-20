import ICustomParser from 'parser/parsers/ICustomParser';

export interface IConfig {
	files: Array<IFile>;
	debug?:boolean;
	forceWrite?:boolean;
	customParser?:{
		parser: ICustomParser;
		fileExtension:Array<string>|string;
	};
}

export interface IFile {
	source:string;
	dest:string;
	mtime?:string;
	mapName?:string;
	disableDirectoryCreation?:boolean;
	template:string;
}