import { deepStrictEqual, throws } from 'assert'
import { Parser } from '../Parser'
import { schema, testData } from './test-data'

interface Context extends Mocha.Context {
	parser: Parser
}

describe('Parser', () => {
	beforeEach(function (this: Context) {
		this.parser = new Parser(schema)
	})

	it('should parse a valid line', function (this: Context) {
		const data = testData[0]
		const result = this.parser.parseLine(data.line)
		deepStrictEqual(result, data.expectedResult)
	})

	it('should throw an error if the line does not match the schema', function (this: Context) {
		const data = testData[0]
		throws(() => {
			// this should yield one value to much.
			const invalidLine = data.line + ' -'
			// this should throw.
			const result = this.parser.parseLine(invalidLine)
			console.log(result)
		}, 'has accepted the invalid line')
	})
})
