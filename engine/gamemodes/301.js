const Gamemode = require("../gamemode");

class ThreeHundredOne extends Gamemode {

    constructor(players, secteurs, isWin) {
        super(players, secteurs, isWin)
      }
    
      async play() {
        // Random player
        this.random()
    
        // Init scores for all players => [...args] of 301
        for (let i = 0; i < this.players.length; i++) {
          let currentPlayer = this.players[i]
          currentPlayer.score = 301
        }
    
        while(!this.isWin) {
          // Check number of players
          if (!this.isPlayable()) {
            break
          }
          // Retrieve players
          for (let index = 0; index < this.players.length; index++) {
            let player = this.players[index]
    
              if (!player.canPlay) {
                continue
              }
              
              for (let s = 0; s < 3; s++) {
                let keepCurrentScore = true
                let currentScore = player.score;
    
                // Player's shoot
                var shoot = await player.multiplierShoot()
    
                if (player.score - (shoot.secteur * shoot.multiplier) == 0 && shoot.multiplier !== 2) {
                  keepCurrentScore = false
                }
    
                if (player.score - (shoot.secteur * shoot.multiplier) == 1) {
                  player.score -= (shoot.secteur * shoot.multiplier)
                  break
                }
    
                let lastScore = 0;
    
                if (player.score - (shoot.secteur * shoot.multiplier) < 0) {
                  keepCurrentScore = false
                  lastScore = player.score
                }
                
                if (keepCurrentScore && currentScore > 0) {
                  player.score -= (shoot.secteur * shoot.multiplier)
                } else {
                  player.score = lastScore
                  break
                }
    
              }
    
              if (player.score == 0) {
                this.isWin = true
                player.canPlay = false
                var winner = player
                break
              } else if (player.score == 1) {
                player.canPlay = false
                console.log(`${player.name} ne peut plus jouer.. C\'est loose tocard !`)
                break
              } else {
                continue
              }
          }
    
          if(this.isWin) {
            this.getScores(winner)
            break
          }
    
          console.log('Score actuel : ')
          console.table(this.players)
        }
      }
    
}

module.exports = ThreeHundredOne