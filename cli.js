/* -----------------------------
            MODULES
 ----------------------------- */

 const inquirer = require('inquirer')
 const Player = require('./engine/player')
 const AroundTheWorld = require('./engine/gamemodes/around-the-world')
 const ThreeHundredOne = require('./engine/gamemodes/301')
 const Cricket = require('./engine/gamemodes/Cricket')
 
/* -----------------------------
           FUNCTIONS
----------------------------- */

async function launchGame() {

    let nbPlayers = await numberOfPlayer()
    let namePlayers = await nameOfPlayers(nbPlayers)

    let playersTab = []
    for (let index = 0; index < namePlayers.length; index++) {
        const name = namePlayers[index]
        playersTab.push(new Player(name))
    }

    let mode = await gameMode()

    let game = null

    switch (mode) {
        case 'Tour du monde':
            game = new AroundTheWorld(playersTab) // Add playersTab
            game.play()
            break
        case '301': 
            game = new ThreeHundredOne(playersTab)
            game.play()
            break
        case 'Cricket':
            game = new Cricket(playersTab)
            game.play()
            break
        default:
            break
    }
}

async function numberOfPlayer() {
    return await inquirer.prompt(
        {
        'type': 'number',
        'name': 'nbPlayers',
        'message': 'Combien de joueur il y a t\'il pour cette partie ? (Minimum 2 joueurs)',
        'default': 2
        },
    ).then((answer) => {
        let { nbPlayers } = answer
        return nbPlayers
    })
}

async function gameMode() {
    return await inquirer.prompt(
        {
        'type': 'list',
        'name': 'gameMode',
        'choices': ['Tour du monde', '301', 'Cricket'],
        'message': 'Choisissez un mode de jeu :'
        }
    ).then((answer) => {
        let { gameMode } = answer
        return gameMode
    })
}

async function nameOfPlayers(nbPlayers) {
    let nameTab = []
    for (let index = 0; index < nbPlayers; index++) {
        await inquirer.prompt(
        {
            'type': 'input',
            'name': 'playerName',
            'message': `Nom du joueur n°${index} : `
        }
        ).then((answer) => {
        nameTab.push(answer.playerName)
        })
    }
    return nameTab
}

/* -----------------------------
           PROGRAMME
----------------------------- */

// Launch game !
launchGame()
