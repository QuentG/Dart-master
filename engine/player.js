const inquirer = require('inquirer')

class Player {

  constructor(name) {
    this.name = name
    this.score = 0
    this.canPlay = true
  }

  async shoot() {
   return await inquirer.prompt({
      'type': 'number',
      'name': 'secteur',
      'message': `${this.name} tire :`
    }).then((answer) => {
      return answer
    })
  }

  async multiplierShoot() {
    return await inquirer.prompt([
      {
        'type': 'number',
        'name': 'secteur',
        'message': `${this.name} tire :`
      },
      {
        'type': 'number',
        'name': 'multiplier',
        'message': `Le multiple :`
      }
    ]).then((answer) => {
      return answer
    })
  }

}

module.exports = Player
