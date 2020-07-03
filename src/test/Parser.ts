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
			} else if (test.wantError) {
				throws(() => {
					// should yield one value to much.
					const invalidLine = test.line + ' -'
					// should throw.
					const result = parser.parseLine(invalidLine)
					console.log(result)
				}, 'has accepted the invalid line')
			} else {
				throw new Error(`no result defined for test case ${test.title}`)
			}
		})
	}
})
