/* -----------------------------
            DATABASE
 ----------------------------- */

const URL_DB = 'mongodb://localhost:27017/dart'

/* -----------------------------
              GAME
 ----------------------------- */

const MODES = ['around-the-world', '301', 'cricket']
const STATUS = ['draft', 'started', 'ended']

module.exports = { URL_DB, MODES, STATUS }