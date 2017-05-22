import { IFile } from '../../src/IConfig';
const path = require('path');

export const filesJs:IFile = {
	source: path.resolve(__dirname, './mockExport.js'),
	dest: path.resolve(__dirname, './mockExport.scss'),
};

export const filesTs:IFile = {
	source: path.resolve(__dirname, './mockExport.ts'),
	dest: path.resolve(__dirname, './mockExport.scss'),
};

export const filesUnkownFileType:IFile = {
	source: path.resolve(__dirname, './mockExport.dex'),
	dest: path.resolve(__dirname, './mockExport.scss')
};