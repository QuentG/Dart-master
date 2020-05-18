const Http = require("./Http")

class InvalidFormat extends Http {
  constructor(message = 'Invalid format', type = 'INVALID_FORMAT') {
    super(message)
    this.status = 400
    this.type = type
  }
}

module.exports = InvalidFormat