/* -----------------------------
            MODULES
 ----------------------------- */

const router = require('express').Router()
const Game = require('../models/Game')
const GamePlayer = require('../models/GamePlayer')
const GameShot = require('../models/GameShot')
const {
  MODES,
  STATUS
} = require('../config')
const NotAvailable = require('../errors/NotAvailable')
const InvalidFormat = require('../errors/InvalidFormat')
const Notfound = require('../errors/NotFound')
const Gone = require('../errors/Gone')
const Unprocessable = require('../errors/Unprocessable')
const _ = require('lodash')
const shuffle = require('shuffle-array')
const AroundTheWorld = require('../engine/gamemodes/Around-the-world')
const ThreeHundrerOne = require('../engine/gamemodes/301')
const Cricket = require('../engine/gamemodes/Cricket')

/* -----------------------------
            ROUTES
 ----------------------------- */

// Get all games
router.get('/', (req, res, next) => {
  Game.getAll(req.query)
    .then((games) => {
      res.format({
        html: () => {
          res.render('games/games', {
            title: 'Games',
            games: games
          })
        },
        json: () => {
          res.json(games)
        }
      })
    })
    .catch((err) => {
      return next(err)
    })
})

// Get form to create game
router.get('/new', (req, res, next) => {
  res.format({
      html: () => {
        res.render('games/form', {
          title: 'Create a game',
          method: '/?_method=POST',
          isNew: true,
        })
      },
      json: () => {
        error = new NotAvailable()
        res.status(error.status).json(error)
      }
    })
    .catch((err) => {
      return next(err)
    })
})

// Create game
router.post('/', (req, res, next) => {
  if (!req.body.name || !req.body.mode) return next(new InvalidFormat('Fill all fields'))

  if (!MODES.includes(req.body.mode)) return next(new InvalidFormat('Select available mode'))

  Game.insert(req.body)
    .then((game) => {
      res.format({
        html: () => {
          res.redirect(301, '/games/' + game.id)
        },
        json: () => {
          res.status(201).json(game)
        }
      })
    })
    .catch((err) => {
      return next(err)
    })

})

// Get one game
router.get('/:id', async (req, res, next) => {
  if (!req.params.id) return next(new InvalidFormat('Fill ID'))

  Game.get(req.params.id, req.query)
    .then(async (game) => {
      if (!game) return next(new Notfound("Game not found"))

      GamePlayer.findCurrentGamePlayer(game.currentPlayerId)
        .then((currentPlayer) => {
          GameShot.getShotsFromGame(req.params.id)
            .then((shots) => {
              res.format({
                html: () => {
                  res.render('games/show', {
                    title: 'Game n°' + game.id,
                    game: game,
                    currentPlayer: currentPlayer,
                    shots: shots
                  })
                },
                json: () => {
                  res.json(game)
                }
              })
            })
        })
    })
    .catch((err) => {
      return next(err)
    })
})

// Get form to edit a game
router.get('/:id/edit', (req, res, next) => {
  if (!req.params.id) return next(new InvalidFormat('Fill ID'))

  Game.get(req.params.id)
    .then((game) => {
      if (!game) return next(new NotFound('Game not found'))

      let { name, status, mode } = game
      res.format({
        html: () => {
          res.render('games/form', {
            title: 'Edit game ' + req.params.id,
            name: name,
            mode: mode,
            status: status,
            isNew: false,
            method: '/' + req.params.id + '?_method=PATCH'
          })
        },
        json: () => {
          error = new NotAvailable()
          res.status(error.status).json(error)
        }
      })

    })
    .catch((err) => {
      return next(err)
    })
})

// Edit a game
router.patch('/:id', async (req, res, next) => {
  if (!req.params.id) return next(new InvalidFormat('Fill ID'))

  if (!req.body.name && !req.body.mode && !req.body.status) return next(new InvalidFormat('To edit you must at least fill a field in fact'))
  if (req.body.status && req.body.status === 'draft') return next(new Unprocessable())

  // Check game && game status
  const game = await Game.get(req.params.id)
  if (!game) return next(new Notfound('Game not found'))
  if (game.status === 'ended') return next(new Gone())
  if (game.status === 'started') return next(new Unprocessable())

  // Check numbers of players
  if (req.body.status && STATUS.includes(req.body.status)) {
    const nbPlayers = await GamePlayer.countPlayersInGame(req.params.id)
    if (nbPlayers < 2) return next(new Unprocessable('Le nombre nécessaire de joueur n\'est pas atteint', 'GAME_PLAYER_MISSING'))
  }

  let changes = {}

  if (req.body.name) {
    changes.name = req.body.name
  }

  if (req.body.mode && MODES.includes(req.body.mode)) {
    changes.mode = req.body.mode
  }

  if (req.body.status && STATUS.includes(req.body.status)) {
    changes.status = req.body.status
    if (req.body.status === 'started') {
      const GamePlayers = await GamePlayer.getPlayersInGame(req.params.id)

      shuffle(GamePlayers) // Randomize player's order
      changes.currentPlayerId = GamePlayers[0].id // Get the first

      await GamePlayer.updateManyPlayers(req.params.id, GamePlayers) // Set all inGame = true + order
      
    //   let mode // Init engine
    //   if (game.mode === 'around-the-world') {
    //     mode = new AroundTheWorld(GamePlayers)
    //   } else if (game.mode === '301') {
    //     mode = new ThreeHundrerOne(GamePlayers)
    //   } else {
    //     mode = new Cricket(GamePlayers)
    //   }
      
    //  mode.play() // Launch game !
    }
  }

  Game.update(changes, req.params.id)
    .then((game) => {
      res.format({
        html: () => {
          res.redirect(301, '/games/' + game.id)
        },
        json: () => {
          res.json(game)
        }
      })
    })
    .catch((err) => {
      return next(err)
    })
})

// Delete a game
router.delete('/:id', (req, res, next) => {
  if (!req.params.id) return next(new InvalidFormat('Fill ID'))

  Game.remove(req.params.id)
    .then(() => {
      GamePlayer.removeFromGame(req.params.id) // Delete GamePlayer's associated to this game
        .then(() => {
          res.format({
            html: () => {
              res.redirect(301, '/games')
            },
            json: () => {
              res.status(204).send()
            }
          })
        })
    })
    .catch((err) => {
      return next(err)
    })
})

// Get game players 
router.get('/:id/players', (req, res, next) => {
  if (!req.params.id) return next(new InvalidFormat('Fill ID'))

  // Get players in game
  GamePlayer.getPlayersInGame(req.params.id)
    .then((playersInGame) => {
      // Get players not in game
      GamePlayer.getPlayersNotInGame(req.params.id)
        .then((playersNotInGame) => {
          res.format({
            html: () => {
              res.render('games/gamePlayers', {
                title: 'Edit game players n°' + req.params.id,
                gameId: req.params.id,
                players: playersNotInGame,
                playersInGame: playersInGame
              })
            },
            json: () => {
              res.json(playersInGame)
            }
          })
        })
    })
    .catch((err) => {
      return next(err)
    })

})

// Add player('s) to game
router.post('/:id/players', (req, res, next) => {
  if (!req.params.id) return next(new InvalidFormat('Fill ID'))
  var body = req.body.player !== undefined ? req.body.player : req.body
  
  Promise.all([
      Game.get(req.params.id),
      GamePlayer.playerIsAlreadyInThisGame(body)
    ])
    .then((values) => {
      if (values[0].status !== 'draft') return next(new Unprocessable('Game already started OR ended', 'PLAYERS_NOT_ADDABLE_GAME_STARTED'))
      var cleanBody = []
      if (values[1].length > 0) {
        for (const player of values[1]) {
          if (body.includes(player.playerId)) cleanBody.push(player.playerId)
        }
      }

      GamePlayer.insertPlayersInGame(cleanBody.length > 0 ? cleanBody : body, req.params.id)
        .then(() => {
          res.format({
            html: () => {
              res.redirect(301, '/games/' + req.params.id + '/players')
            },
            json: () => {
              res.status(204).send()
            }
          })
        })
    }).catch((err) => {
      return next(err)
    })

})

// Delete player('s) to game
router.delete('/:id/players', (req, res, next) => {
  if (!req.params.id) return next(new InvalidFormat('Fill ID'))

  Game.get(req.params.id)
    .then((game) => {
      if (game.status !== 'draft') return next(new Unprocessable('Game already started', 'PLAYERS_NOT_REMOVABLE_GAME_STARTED'))

      const playersId = req.query.id === undefined ? req.body.id : req.query.id // Cast
      // Delete player('s)
      GamePlayer.deletePlayersInGame(playersId, req.params.id)
        .then(() => {
          res.format({
            html: () => {
              res.redirect(301, '/games/' + req.params.id + '/players')
            },
            json: () => {
              res.status(204).send()
            }
          })
        })
    })
    .catch((err) => {
      return next(err)
    })

})

// Insert a shot
router.post('/:id/shots', (req, res, next) => {
  if (!req.params.id) return next(new InvalidFormat('Fill ID'))

  if (!req.body.sector && !req.body.multiplicator) return next(new InvalidFormat('Fill all fields'))

  Game.get(req.params.id)
    .then((game) => {
      if (game.status === 'draft') return next(new Unprocessable('Game status : draft', 'GAME_NOT_STARTED'))
      if (game.status === 'ended') return next(new Unprocessable('Game status : ended', 'GAME_ENDED'))
      GameShot.insertShot(req.body, req.params.id, game.currentPlayerId)
        .then(() => {
          res.format({
            html: () => {
              res.redirect(301, '/games/' + req.params.id)
            },
            json: () => {
              res.status(204).send()
            }
          })
        })
    })
    .catch((err) => {
      return next(err)
    })

})

// Delete previous shot
router.delete('/:id/shots/previous', (req, res, next) => {
  if (!req.params.id) return next(new InvalidFormat('Fill ID'))

  GameShot.removePreviousShot(req.params.id)
    .then(() => {
      res.format({
        html: () => {
          res.redirect(301, '/games/' + req.params.id)
        },
        json: () => {
          res.status(204).send()
        }
      })
    })
    .catch((err) => {
      return next(err)
    })
})

module.exports = router