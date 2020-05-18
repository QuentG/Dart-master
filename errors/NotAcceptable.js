const Http = require("./Http")

class NotAcceptable extends Http {
  constructor(message = 'Not found', type = 'NOT_ACCEPTABLE') {
    super(message)
    this.status = 406
    this.type = type
  }
}

module.exports = NotAcceptable