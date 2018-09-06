import { Parser } from '../Parser'
import { lines, schema } from './test-data'

describe('Parser', () => {
	beforeEach(function () {
		this.parser = new Parser(schema)
	})

	it('should parse the first line', function () {
		console.log(this.parser.parseLine(lines[0]))
	})
})
