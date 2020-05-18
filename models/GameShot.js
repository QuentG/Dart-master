/* -----------------------------
            MODULES
 ----------------------------- */

const db = require('../db')
const Game = require('./Game')

/* -----------------------------
            SCHEMA
 ----------------------------- */

var gameShot = new db.Schema({
  id: String,
  gameId: String,
  playerId: String,
  multiplicator: Number,
  selector: Number,
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false } )

var GameShot = db.model('game_shot', gameShot)
 
/* -----------------------------
           FUNCTIONS
 ----------------------------- */

module.exports = {
  insertShot : (params, gameId, playerId) => {
    let values = {
      'gameId': gameId,
      'playerId': playerId,
      'multiplicator': params.multiplicator,
      'selector': params.sector
    }

    return (new GameShot(values)).save()
  },

  getShotsFromGame: async (id) => {
    return GameShot.find({ gameId: id }).sort({ createdAt: -1 })
  },

  removePreviousShot : async (id) => {
    const game = await Game.get(id)

    return GameShot.findOneAndRemove({ gameId: id, playerId: game.currentPlayerId }).sort({ createdAt: -1 }) // Get last insertion for this GamePlayer + remove
  }
}

 
 
 
 
 