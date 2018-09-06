class ValueParser {
	constructor(modSet = []) {
		this.mod = modSet
	}

	public add(name, modifier) {
		this.mod.push({
			name,
			fn: modifier,
		})

		return this
	}

	public remove(name) {
		let i = this.mod.length

		while (i--) {
			if (this.mod[i].name === name) {
				this.mod.splice(i, 1)
			}
		}

		return this
	}

	public removeAll() {
		this.mod = []

		return this
	}

	public parse(string, prop) {

		for (let i = 0; i < this.mod.length; i++) {
			const v = this.mod[i].fn(string, prop)

			if (v !== string) {
				return v
			}
		}

		return string
	}
}

module.exports = ValueParser

