import test from 'ava';
import { filesJs, filesTs } from './mock/ConfigMock';
import JsParser from '../src/parser/parsers/JsParser';
import TsParser from '../src/parser/parsers/JsParser';

test('Should return undefined when done', async t => {
	t.plan(2);
	let parser = null;
	let value = null;

	parser = new JsParser(filesJs);
	value = await parser.run();
	t.true(value === void(0));

	parser = new TsParser(filesTs);
	value = await parser.run();
	t.true(value === void(0));
});
