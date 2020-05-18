const Http = require("./Http")

class Unprocessable extends Http {
  constructor(message = 'Game déjà lancée OU terminée', type = 'GAME_NOT_STARTABLE') {
    super(message)
    this.type = type
    this.status = 422
  }
}

module.exports = Unprocessable