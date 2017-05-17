export interface IConfig {
	files: Array<IFile>;
	debug?:boolean;
	forceWrite?:boolean;
}

export interface IFile {
	source:string;
	dest:string;
	mtime?:string;
}