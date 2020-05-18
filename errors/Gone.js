const Http = require("./Http")

class Gone extends Http {
  constructor(message = 'Game non éditable', type = 'GAME_NOT_EDITABLE') {
    super(message)
    this.type = type
    this.status = 410
  }
}

module.exports = Gone