import prompts from "prompts";
import {TicTacToe} from "./game";
import {AiPlayer} from "./ai";
import {HumanPlayer} from "./human";
import pc from "picocolors"

(async () => {

    const {xPlayerType, oPlayerType, gameSize} = await prompts([
        {
            type: 'select',
            name: 'xPlayerType',
            message: 'What type of player for X?',
            choices: [
                {
                    title: 'OpenAI',
                    value: 'ai'
                },
                {
                    title: 'Human',
                    value: 'human'
                }
            ],
        },
        {
            type: 'select',
            name: 'oPlayerType',
            message: 'What type of player for O?',
            choices: [
                {
                    title: 'OpenAI',
                    value: 'ai'
                },
                {
                    title: 'Human',
                    value: 'human'
                }
            ],
        },
        {
            type: 'number',
            name: 'gameSize',
            message: 'What size game board would you like?',
            initial: 3,
        },
    ])

    const game = new TicTacToe(gameSize);
    game.display(true);

    const getPlayer = (player, type) => {
        if (type === 'ai') {
            return new AiPlayer(game, player);
        } else {
            return new HumanPlayer(game, player);
        }
    };

    const xPlayer = getPlayer('X', xPlayerType);
    const oPlayer = getPlayer('O', oPlayerType);

    while (!game.isOver) {
        console.log(pc.gray('Total moves made: ' + game.movesMade))
        console.log(pc.gray('Current player: ' + game.currentPlayer))

        if(game.currentPlayer === 'X') {
            await xPlayer.makeMove();
        } else if(game.currentPlayer === 'O') {
            await oPlayer.makeMove();
        }

        console.log(`Move finished, board is now:`)
        console.log(pc.green(game.display()));
    }

    console.log(`Game is finished, winner is: ${game.getWinner ?? 'Tie'}`)

})();
