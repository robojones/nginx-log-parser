const identifierAndValue = /^(\w*)(.*?)$/
const capture = '(.+?)'

/**
 * A parser for Nginx access and error log files.
 */
export class Parser {
	/** The identifiers from the schema. */
	private identifiers: string[] = []
	/** Expression that parses all values from a line. */
	private schema: RegExp

	/**
	 * @param template The schema that's provided in the Nginx config.
	 */
	constructor(template: string) {
		// Split the template at the $ identifier.
		const parts = template.split('$')
		/** The pieces that are between the identifiers. */
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

	/**
	 * Parse a line from the access log.
	 * The line must match the initial template.
	 * Throws a TypeError if the line does not match the schema.
	 * Be aware that some lines won't be detected as invalid.
	 * @param line A line from the log file.
	 */
	public parseLine(line: string) {
		const values = line.match(this.schema)
		if (!values || values.length - 1 !== this.identifiers.length) {
			throw new TypeError('Line does not match the schema. line: ' + line)
		}

		// Remove the first item since it's the complete line.
		values.shift()
		const result: { [key: string]: string } = {}

		for (let i = 0; i < values.length; i++) {
			const identifier = this.identifiers[i]
			const value = values[i]
			// Unescape the hex escape sequences that Nginx creates.
			result[identifier] = unescape(value)
		}

		return result
	}

	/**
	 * Replace characters that could break the RegExp (E.g. dots, brackets,...).
	 * @param str The string to escape.
	 */
	private escapeRegExpLiteral(str: string): string {
		return str.replace(/[\\.?*+^$|\-\(\)\{\}\[\]]/g, '\\$&')
	}
}
