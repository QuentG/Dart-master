const Gamemode = require('../gamemode')

class AroundTheWorld extends Gamemode {

  constructor(players, secteurs, isWin) {
    super(players, secteurs, isWin)
    this.secteurs = []
  }

  async play() {
    // Random player
    this.random()

    // Init secteurs for all players => [...args] of 1
    for (let i = 0; i < this.players.length; i++) {
      this.secteurs.push(1)
    }

    while(!this.isWin) {
      // Check number of players 
      if (!this.isPlayable()) {
        break
      }
      // Retrieve players
      for (let index = 0; index < this.players.length; index++) {
        let player = this.players[index];

        // 3 shoot per player
        for (let s = 0; s < 3; s++) {   
          // Player's shoot
          var shoot = await player.shoot()

          if(this.secteurs[index] == shoot.secteur) {
            this.secteurs[index]++
            player.score++
          }

          if(this.secteurs[index] == 21) {
            this.isWin = true
            break
          }
          
        }

        if(this.isWin) {
          this.getScores(player)
          break
        }
        
        console.log(`Le score de ${player.name} est de ${player.score}`)
      }
    }
  }

}

module.exports = AroundTheWorld