const Http = require("./Http")

class NotAvailable extends Http {
  constructor(message = 'Not API available', type = 'NOT_API_AVAILABLE') {
    super(message)
    this.status = 406
    this.type = type
  }
}

module.exports = NotAvailable