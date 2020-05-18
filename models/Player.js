/* -----------------------------
            MODULES
 ----------------------------- */

const db = require('../db')
const _ = require('lodash')

/* -----------------------------
            SCHEMA
 ----------------------------- */

var playerSchema = new db.Schema({
  name: String,
  email: String,
  gameWin: { type: Number, default: 0 },
  gameLoose: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false } )

var Player = db.model('players', playerSchema)

/* -----------------------------
            FUNCTIONS
 ----------------------------- */

module.exports = {
  get : async (playerId) => {
    return Player.findOne({ _id: playerId })
  },  

  getAll : async (params) => {
    if (params === undefined) return Player.find({})  // Get all without params

    let limit = params.limit ? parseInt(params.limit) : 10
    let page = params.page ? parseInt(params.page) : 1

    req = (Player.find({})
                .limit(limit)
                .sort({ [params.sort]: 1 })
                .skip((page * limit) - limit))

    if (params.reverse !== undefined) req.sort({ _id : -1 })

    return req
  },

  insert : async (params) => {
    return (new Player({ 'name': params.name, 'email': params.email })).save()
  },

  update : async (params, playerId) => {
    let values = {}

    _.forIn(params, (value, key) => {
        values[key] = value
    })

    await Player.updateOne({ _id: playerId }, values)

    return Player.findOne({ _id: playerId })
  },

  remove : async (playerId) => {
    return Player.deleteOne({ _id: playerId })
  }

}





