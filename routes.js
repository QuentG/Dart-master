/* -----------------------------
            MODULES
 ----------------------------- */

const router = require('express').Router()
const gameRouter = require('./routers/game')
const playerRouter = require('./routers/game/player')
const NotAvailable = require('./errors/NotAvailable')
const NotFound = require('./errors/NotFound')

/* -----------------------------
            ROUTES
 ----------------------------- */

// Set base url foreach router
router.use('/games', gameRouter)
router.use('/players', playerRouter)

// Default route
router.all('/', (req, res, next) => {
  res.format({
    html: () => {
      res.redirect(301, '/games')
    },
    json: () => { 
      error = new NotAvailable()
      res.status(error.status).json(error)
    }
  })
})

// Middleware
router.use((err, req, res, next) => {
  res.format({
    html: () => {
      res.render("error", {
        title: err ? 'Error ' + err.status : 'Error 404',
        error: err ? err : 'Error 404'
      })
    },
    json: () => {
      err ? res.status(err.status === undefined ? 400 : err.status).json(err) : res.status(404).json(new NotFound())
    }
  })
})

module.exports = router