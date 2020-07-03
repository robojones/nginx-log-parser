import { deepStrictEqual, throws } from 'assert'
import { Parser } from '../Parser'
import { tests } from './tests'

describe('Parser', () => {
	for (const test of tests) {
		it(test.title, () => {
			const schema = test.schema
			const parser = new Parser(schema)

			if (test.want) {
				const result = parser.parseLine(test.line)
				deepStrictEqual(result, test.want)
			} else {
				throws(() => {
					// should yield one value to much.
					const invalidLine = test.line + ' -'
					// should throw.
					parser.parseLine(invalidLine)
				}, 'has accepted the invalid line')
			}
		})
	}
})
