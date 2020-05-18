/* -----------------------------
            MODULES
 ----------------------------- */

const router = require('express').Router()
const Player = require('../../models/Player')
const GamePlayer = require('../../models/GamePlayer')
const NotAvailable = require('../../errors/NotAvailable')
const InvalidFormat = require('../../errors/InvalidFormat')
const NotFound = require('../../errors/NotFound')
const Gone = require('../../errors/Gone')
const validator = require('email-validator')
const moment = require('moment')
moment.locale('fr')

/* -----------------------------
            ROUTES
 ----------------------------- */

// Get all player
router.get('/', (req, res, next) => {
  if (req.query.limit && req.query.limit > 20) return next(new InvalidFormat('Limit can\'t be more than 20'))

  Player.getAll(req.query)
  .then((players) => {
    res.format({
      html: () => {
        res.render("players/players", {
          title: 'Players',
          players: players,
          moment: moment
        })
      },
      json: () => {
        res.json(players)
      }
    })
  }).catch((err) => {
    return next(err)
  })
})

// Add player 
router.post('/', (req, res, next) => {
  if (!req.body.name || !req.body.email) return next(new InvalidFormat('Fill all fields'))

  if (!validator.validate(req.body.email)) return next(new InvalidFormat('Invalid email format'))
  
  Player.insert(req.body)
  .then((player) => {
    res.format({
      html : () => {
        res.redirect(301, '/players/' + player.id)
      },
      json : () => {
        res.status(201).json(player)
      }
    })
  }).catch((err) => {
    return next(err)
  })
})

// Get form to add player
router.get('/new', (req, res, next) => {
  res.format({
    html : () => {
      res.render('players/form', {
        title: 'Add a player',
        method: '/?method=POST',
        isNew: true
      })
    },
    json : () => {
      error = new NotAvailable()
      res.status(error.status).json(error)
    }
  })
})

// Get one player
router.get('/:id', (req, res, next) => {
  if (!req.params.id) return next(new InvalidFormat('Fill ID'))

  Player.get(req.params.id)
  .then((player) => {
    if (!player) return next(new NotFound('Player not found'))

    res.format({
      html : () => {
        res.redirect(301, '/players/' + player.id + '/edit')
      },
      json : () => {
        res.json(player)
      }
    })
  })
  .catch((err) => {
    return next(err)
  })

})

// Get form to edit a player
router.get('/:id/edit', (req, res, next) => {
  if (!req.params.id) return next(new InvalidFormat('Fill ID'))

  Player.get(req.params.id)
  .then((player) => {
    if (!player) return next(new NotFound('Player not found'))

    res.format({
      html : () => {
        res.render('players/form', {
          title: 'Edit player n°' + req.params.id,
          player: player,
          isNew: false,
          method: '/' + req.params.id + '?_method=PATCH'
        })
      },
      json : () => {
        error = new NotAvailable()
        res.status(error.status).json(error)
      }
    })

  })
  .catch((err) => {
    return next(err)
  })
})

// Edit a player
router.patch('/:id', (req, res, next) => {
  if (!req.params.id) return next(new InvalidFormat('Fill ID'))

  if (!req.body.name && !req.body.email) return next(new InvalidFormat('To edit you must at least fill a field in fact'))

  let changes = {}

  if (req.body.name) {
    changes.name = req.body.name 
  }

  if (req.body.email) {
    if (!validator.validate(req.body.email)) return next(new InvalidFormat('Invalid email format'))
    changes.email = req.body.email 
  }

  Player.update(changes, req.params.id)
  .then((player) => {
    res.format({
      html : () => {
        res.redirect(301, '/players')
      },
      json : () => {
        res.json(player)
      }
    })
  })
  .catch((err) => {
    return next(err)
  })

})

// Delete a player
router.delete('/:id', async (req, res, next) => {
  if (!req.params.id) return next(new InvalidFormat('Fill ID'))

  const isInGame = await GamePlayer.getGamesOfPlayer(req.params.id)
  if (isInGame === 'in_game') return next(new Gone('Player is playing', 'PLAYER_NOT_DELETABLE'))

  Player.remove(req.params.id)
  .then(() => {
    res.format({
      html : () => {
        res.redirect(301, '/players')
      },
      json : () => {
        res.status(204).send()
      }
    })
  })
  .catch((err) => {
    return next(err)
  })
})


module.exports = router