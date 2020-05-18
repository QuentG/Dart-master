const shuffle = require('shuffle-array')

class Gamemode {

  constructor(players) {
    this.players = players
    this.secteurs = 20
    this.isWin = false
  }

  play() {}

  // Random player
  random() {
    shuffle(this.players)
    console.log('Ordre des joueurs :')
    console.table(this.players)
  }

  isPlayable() {
    if (this.players.length <= 1) {
      console.log('Désolé mais on ne peut pas jouer tout seul :(')
      return false
    }
    return true
  }

  getScores(player, sortDesc = true) {
    console.clear()
    console.log(`Joueur gagnant : ${player.name} ! 🔥`)
    if (sortDesc) {
      console.table(this.players.sort((a, b) => (a.score > b.score) ? -1 : 1))
    } else {
      console.table(this.players.sort((a, b) => (a.score > b.score) ? 1 : -1))
    }
  }

  isShootAcceptable(array, shoot) {
     return array.includes(shoot)
  }

  compare(a1, a2) {
    return a1.length == a2.length
  }

}

module.exports = Gamemode