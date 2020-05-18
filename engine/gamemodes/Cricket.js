const Gamemode = require("../gamemode");

class Cricket extends Gamemode {
    constructor(players, secteurs, isWin) {
        super(players, secteurs, isWin)
        this.secteurs = [
          15, 
          16, 
          17, 
          18, 
          19, 
          20,
          25
        ]
        this.winner = ''
      }
    
      async play() {
        // Random player
        this.random()
    
        // Init scores for all players => [...args] of 301
        for (let i = 0; i < this.players.length; i++) {
          // Init all values with 3 'life'
          let scores = {
            '15': 3,
            '16': 3,
            '17': 3,
            '18': 3,
            '19': 3,
            '20': 3,
            '25': 3 // Bulle
          }
          let currentPlayer = this.players[i]
          // Insert
          currentPlayer['secteurs'] = scores
        }
    
        while(!this.isWin) {
          // Check number of players
          if (!this.isPlayable()) {
            break
          }
    
          console.table(this.players)
    
          // Retrieve players
          for (let index = 0; index < this.players.length; index++) {
            let player = this.players[index]
    
            for (let s = 0; s < 3; s++) {
               // Get player's shoot
               var shoot = await player.multiplierShoot()
               let secteur = shoot.secteur
               let multiplier = shoot.multiplier
    
               if(!this.isShootAcceptable(this.secteurs, secteur)) {
                 console.log(`${player.name}, tu n'as pas tirer sur une case valide !`)
                 continue
               }
               
               // Check if this secteur is not closed
               if(player.secteurs[secteur.toString()] > 0) {
                 player.secteurs[secteur.toString()]--
                
               } else if(player.secteurs[secteur.toString()] == 0) {
                player.score += secteur * multiplier;
               }
              
            }
          
            console.log(`Score du joueur ${player.name}`)
            console.table(player.secteurs)
    
            let tmpSecteurs = []
    
            for (const value in player.secteurs) {    
              console.log(player.secteurs[value])
              if(player.secteurs[value] == 0) {
                tmpSecteurs.push(player.secteurs[value])
              } 
            }
    
            // Si il a touche 3 fois toutes les cases
            if(this.compare(this.secteurs, tmpSecteurs)) {
              this.isWin = true
              this.winner = player.name
            }
            
          }
    
          if(this.isWin) {
            this.getScores(winner)
            break
          }
    
        }
    
      }
    
}

module.exports = Cricket