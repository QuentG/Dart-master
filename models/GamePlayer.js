/* -----------------------------
            MODULES
 ----------------------------- */

const db = require('../db')
const Player = require('./Player')
const Game = require('./Game')

/* -----------------------------
            SCHEMA
----------------------------- */
 
var gamePlayer = new db.Schema({
  playerId: String,
  gameId: String,
  remainingShots: { type: Number, default: 3 },
  score: { type: Number, default: 0 },
  rank: { type: Number, default: null },
  order: { type: Number, default: null },
  inGame: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false } )
 
var GamePlayer = db.model('game_player', gamePlayer)
  
/* -----------------------------
           FUNCTIONS
----------------------------- */

module.exports = {
  get: async (id, playerId) => {
    return GamePlayer.findOne({ gameId: id, playerId: playerId })
  },

  getGamesOfPlayer: async (id) => {
    const gamesPlayer = await GamePlayer.find({ playerId: id })
    const Game = require('./Game')

    for (const gamePlayer of gamesPlayer) {
      const game = await Game.get(gamePlayer.gameId)
      // Check if player is in started game !
      if (game.status === 'started') return 'in_game'
    }

    return ''
  },

  getPlayersInGame: async (id) => {
    const gamePlayers = await GamePlayer.find({ gameId: id })
    let tab = []

    for (const gamePlayer of gamePlayers) {
      const player = await Player.get(gamePlayer.playerId)
      tab.push(player)
    }

    return tab
  },

  getPlayersNotInGame: async (id) => {
    const players = await Player.getAll()
    let tab = []

    for (const player of players) {
      const isInGame = await GamePlayer.findOne({ gameId: id, playerId: player.id })

      if (null === isInGame) {
        tab.push(player)
      }
    }

    return tab
  },

  playerIsAlreadyInThisGame: async (body) => {
    return GamePlayer.find({ playerId: { $in: body } })
  },
  
  countPlayersInGame: async (id) => {
    return GamePlayer.find({ gameId: id }).countDocuments()
  },

  findCurrentGamePlayer: async (id) => {
    return await Player.get(id)
  },

  insertPlayersInGame: async (body, gameId) => {
    if (Array.isArray(body)) {
      body.forEach(playerId => {
        new GamePlayer({ 'gameId': gameId, 'playerId': playerId }).save() // Create game player
      })
    } else {
      new GamePlayer({ 'gameId': gameId, 'playerId': body }).save() // Create game player
    }
  },

  updateManyPlayers: async (id, gamePlayers) => {
    let order = 1
    
    for (const gamePlayer of gamePlayers) {
      await GamePlayer.updateOne({ gameId: id, playerId: gamePlayer.id }, { 'inGame': true, 'order': order })
      order++
    }
  },

  deletePlayersInGame: async (query, gameId) => {
    if (Array.isArray(query)) {
      // Itterate on each playerId
      for (const id of query) {
        await GamePlayer.deleteOne({ playerId: id, gameId: gameId })
      }
    } else {
      await GamePlayer.deleteOne({ playerId: query, gameId: gameId })
    }
  },

  removeFromGame: async (id) => {
    return GamePlayer.remove({ gameId: id })
  }
}
 
  
  
  
  
  