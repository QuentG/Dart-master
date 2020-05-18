const Http = require("./Http")

class NotFound extends Http {
  constructor(message = 'Not found', type = 'NOT_FOUND') {
    super(message)
    this.status = 404
    this.type = type
  }
}

module.exports = NotFound