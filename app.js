/* -----------------------------
            MODULES
 ----------------------------- */

const express = require('express')
const app = express()
const router = require('./routes')
const PORT = process.env.PORT || 8035;
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

/* -----------------------------
          CONF SERVEUR
 ----------------------------- */

// Body parser
app.use(bodyParser.urlencoded({ extended: false })) // www-form-urlencoded
app.use(bodyParser.json()) // application/json

// Method override
app.use(methodOverride('_method'))

// Views
app.set('views', './views')
app.set('view engine', 'ejs')
app.engine('ejs', require('ejs-blocks'))

// Assets
app.use('/', express.static(__dirname + '/assets'));

// Connect router
app.use(router)

// Run serveur
app.listen(PORT, () => console.log('Serveur lancé : http://localhost:' + PORT ))
