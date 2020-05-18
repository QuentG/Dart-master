class Http extends Error {
    toJSON() {
      return {
        error: {
          type: this.type || 'SERVER_ERROR',
          message: this.message || 'Server error'
        }
      }
    }
}

module.exports = Http