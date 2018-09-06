const esc = require('./regexpEscape')
const ValueParser = require('./ValueParser')
const modList = require('./modList')

const rEscapeCharacters = /\\x([a-fA-F0-9]{2})/g

class Parser {
	constructor(schema, prop) {
		this.schema = schema
		this.prop = prop
		this.valueParser = new ValueParser(modList.slice())
	}

	parse(string) {
		const lines = string.split('\n')

		return lines.map((line, i) => {
			return this.parseLine(line)
		}).filter(v => v)
	}

	parseLine(line) {
		const data = line.match(this.schema)

		if(!data) {
				return null
		}

		data.shift()

		const result = {}

		data.forEach((value, i) => {
			const prop = this.prop[i]

			value = value.replace(rEscapeCharacters, (match, s) => {
				return String.fromCharCode(parseInt(s, 16))
			})

			result[prop] = this.valueParser.parse(value, prop)
		})

		return result
	}
}

module.exports = Parser

