function esc(string) {
	return string.replace(/[\\\[.?*+^$({|-]/g, "\\$&")
}

module.exports = esc

