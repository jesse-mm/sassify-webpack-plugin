"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const ParserFactory_1 = require("../src/parser/ParserFactory");
const ConfigMock_1 = require("./mock/ConfigMock");
const ConfigMock_2 = require("./mock/ConfigMock");
const ConfigMock_3 = require("./mock/ConfigMock");
const JsParser_1 = require("../src/parser/parsers/JsParser");
const TsParser_1 = require("../src/parser/parsers/TsParser");
ava_1.default('Expect a instanceOf JsParser', (t) => __awaiter(this, void 0, void 0, function* () {
    const pfactory = new ParserFactory_1.default(ConfigMock_1.filesJs);
    t.true(pfactory.parser instanceof JsParser_1.default);
}));
ava_1.default('Expect a instanceOf TsParser', (t) => __awaiter(this, void 0, void 0, function* () {
    const pfactory = new ParserFactory_1.default(ConfigMock_2.filesTs);
    t.true(pfactory.parser instanceof TsParser_1.default);
}));
ava_1.default('Should throw an error', (t) => __awaiter(this, void 0, void 0, function* () {
    const pfactory = new ParserFactory_1.default(ConfigMock_3.filesUnkownFileType);
    t.throws(() => pfactory.parser, Error);
}));
