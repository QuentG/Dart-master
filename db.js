/* -----------------------------
            MODULES
 ----------------------------- */

const mongoose = require('mongoose');
const { URL_DB } = require('./config');

/* -----------------------------
            FUNCTIONS
 ----------------------------- */

// Connect to database
mongoose.connect(URL_DB, { 
  useNewUrlParser: true,
  useUnifiedTopology: true 
})

const conn = mongoose.connection

conn.on('error', (err) => { 
  console.log('> Error occurred from the database : ', err)
})

conn.on("open", () => { 
  console.log('> Database are ready !') 
})

module.exports = mongoose