const esc = require('./regexpEscape')
const Parser = require('./Parser')

const reg = /^(\w*)(.*?)$/
const capture = '(.+?)'

function createParser(template) {
	const parts = template.split('$').map(part => part.match(reg))
	const sep = parts.map(part => esc(part[2]))
	const prop = parts.map(part => part[1])
	prop.shift()

	const s = '^' + sep.join(capture) + '$'
	const schema = new RegExp(s)

	return new Parser(schema, prop)
}

module.exports = createParser

