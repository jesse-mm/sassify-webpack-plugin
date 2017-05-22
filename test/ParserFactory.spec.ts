import test from 'ava';
import ParserFactory from '../src/parser/ParserFactory';
import { filesJs } from './mock/ConfigMock';
import { filesTs } from './mock/ConfigMock';
import { filesUnkownFileType } from './mock/ConfigMock';
import JsParser from '../src/parser/parsers/JsParser';
import TsParser from '../src/parser/parsers/TsParser';

test('Expect a instanceOf JsParser', async t => {
	const pfactory = new ParserFactory(filesJs);
	t.true(pfactory.parser instanceof JsParser);
});

test('Expect a instanceOf TsParser', async t => {
	const pfactory = new ParserFactory(filesTs);
	t.true(pfactory.parser instanceof TsParser);
});

test('Should throw an error', async t => {
	const pfactory = new ParserFactory(filesUnkownFileType);
	t.throws(() => pfactory.parser, Error);
});
