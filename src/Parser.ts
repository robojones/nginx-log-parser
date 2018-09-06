const identifierAndValue = /^(\w*)(.*?)$/
const capture = '(.+?)'

export class Parser {
	/** The identifiers from the schema. */
	private identifiers: string[] = []
	/** Expression that parses all values from a line. */
	private schema: RegExp

	constructor(template: string) {
		// Split the template at the $ identifier.
		const parts = template.split('$')
		// The pieces that are between the identifiers.
		const delimiters: string[] = []

		// The first item is always a delimiter.
		delimiters.push(parts.shift() as string)

		for (const part of parts) {
			const token = part.match(identifierAndValue) as RegExpMatchArray
			this.identifiers.push(token[1])

			// Escape all critical chars so they won't break the RegExp.
			const delimiter = this.escapeRegExpLiteral(token[2])
			delimiters.push(delimiter)
		}

		const regexpString = '^' + delimiters.join(capture) + '$'
		this.schema = new RegExp(regexpString)
	}

	public parseLine(line: string) {
		const values = line.match(this.schema)
		if (!values) {
			throw new TypeError('Line does not match the line ' + line)
		}

		values.shift()
		const result: { [key: string]: string } = {}

		for (let i = 0; i < values.length; i++) {
			const identifier = this.identifiers[i]
			const value = values[i]
			result[identifier] = unescape(value)
		}

		return result
	}

	/**
	 * Replace characters that could break the RegExp (E.g. dots, brackets,...).
	 */
	private escapeRegExpLiteral(str: string): string {
		return str.replace(/[\\\[.?*+^$({|-]/g, '\\$&')
	}
}
