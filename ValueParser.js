class ValueParser {
  constructor(modSet = []) {
    this.mod = modSet
  }

  add(name, modifier) {
    this.mod.push({
      name: name,
      fn: modifier
    })

    return this
  }
  
  remove(name) {
    let i = this.mod.length
    
    while(i--) {
      if(this.mod[i].name === name) {
        this.mod.splice(i, 1)
      }
    }

    return this
  }
  
  removeAll() {
    this.mod = []
    
    return this
  }

  parse(string, prop) {

    for(let i = 0; i < this.mod.length; i++) {
      const v = this.mod[i].fn(string, prop)

      if(v !== string) {
        return v
      }
    }

    return string
  }
}

module.exports = ValueParser

