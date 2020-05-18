/* -----------------------------
            MODULES
 ----------------------------- */

 const db = require('../db')
 const { STATUS } = require('../config')
 const _ = require('lodash')
 const GamePlayer = require('./GamePlayer')

/* -----------------------------
            SCHEMA
 ----------------------------- */

var gameSchema = new db.Schema({
  name: String,
  mode: String,
  currentPlayerId: { type: String, default: null, required: false },
  status: { type: String, default: 'draft' },
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false } )

 var Game = db.model('games', gameSchema)

 /* -----------------------------
            FUNCTIONS
 ----------------------------- */
 
 module.exports = {
   get: async (gameId, query) => {
    let currentGame = await Game.findOne({ _id: gameId })

    if (query === undefined) return currentGame
    if (query.include === undefined) return currentGame
    
    if (query.include === 'gamePlayers') {
      // Get players in game 
      currentGame._doc['gamePlayers'] = await GamePlayer.getPlayersInGame(gameId)
    }

    return currentGame
   },
   
  getAll: async (params) => {
    let limit = params.limit ? parseInt(params.limit) : 10
    let page = params.page ? parseInt(params.page) : 1

    if (params.status && STATUS.includes(params.status)) {
      req = (Game.find({ status: params.status }))
    } else {
      req = (Game.find({}))
    }
    
    (req.limit(limit).sort({ [params.sort]: 1 }).skip((page * limit) - limit))

    if (params.reverse == '') req.sort({ _id : -1 })

    return req
  },

   insert: async (params) => {
     return (new Game({ 'name': params.name, 'mode': params.mode })).save()
   },

   update: async (params, gameId) => {
    let values = {}

    _.forIn(params, (value, key) => {
        values[key] = value
    })

    await Game.updateOne({ _id: gameId }, values)

    return Game.findOne({ _id: gameId })
   },

   remove : async (gameId) => {
     return Game.deleteOne({ _id: gameId })
   }

 }
 
 
 
 
 
 