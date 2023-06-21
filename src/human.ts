import {TicTacToe, TicTacToePlayer} from "./game";
import prompts from "prompts";

export class HumanPlayer {

    game: TicTacToe;
    player: TicTacToePlayer;

    constructor(game: TicTacToe, player: TicTacToePlayer) {
        this.game = game;
        this.player = player;
    }

    async makeMove() {
        const {row, column} = await prompts([
            {
                type: 'number',
                name: 'row',
                message: 'What row would you like to play?',
            },
            {
                type: 'number',
                name: 'column',
                message: 'What column would you like to play?',
            }
        ]);

        try {
            this.game.setMove(this.player, row, column);
        } catch (e) {
            console.log(`Invalid move: ${e.message}, please try again.`);
            await this.makeMove();
        }
    }
}
