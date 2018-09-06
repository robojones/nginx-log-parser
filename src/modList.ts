const ValueParser = require('./ValueParser')

const vParser = new ValueParser

vParser
	.add('number', string => {
		if(!isNaN(+string)) {
			return +string
		}

		return string
	})

	.add('null', string => {
		if(string === '-') {
			return null
		}

		return string
	})

	.add('request', (string, prop) => {
		if(prop === 'request') {
			const parts = string.split(' ')

			return {
				method: parts.shift(),
				url: parts.shift(),
				protocol: parts.shift()
			}
		}

		return string
	})

module.exports = vParser.mod

