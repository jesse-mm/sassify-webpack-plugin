"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
exports.filesJs = {
    source: path.resolve(__dirname, './mockExport.js'),
    dest: path.resolve(__dirname, './mockExport.scss'),
};
exports.filesTs = {
    source: path.resolve(__dirname, './mockExport.ts'),
    dest: path.resolve(__dirname, './mockExport.scss'),
};
exports.filesUnkownFileType = {
    source: path.resolve(__dirname, './mockExport.dex'),
    dest: path.resolve(__dirname, './mockExport.scss')
};
