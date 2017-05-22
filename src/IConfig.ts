import IParser from './parser/parsers/IParser';

export interface IConfig {
	files: Array<IFile>;
	debug?:boolean;
}

/**
 * Interface for files property
 */
export interface IFile {
	source:string;
	dest:string;
	// mtime is set by SassifyWebpackPlugin
	mtime?:string;
	mapName?:string;
	disableDirectoryCreation?:boolean;
	template?:string;
	parser?: IParser;
}