import {TicTacToe, TicTacToePlayer} from "./game";
import {OpenAI, PromptTemplate} from "langchain";
import {OutputFixingParser, StructuredOutputParser} from "langchain/output_parsers";
import { z } from "zod";
import {BaseOutputParser} from "langchain/dist/schema/output_parser";
import pc from "picocolors";

export class AiPlayer {

    game: TicTacToe;
    player: TicTacToePlayer;

    private parser: BaseOutputParser<any>;

    constructor(game: TicTacToe, player: TicTacToePlayer) {
        this.game = game;
        this.player = player;

        this.parser =  StructuredOutputParser
            .fromZodSchema(z.object({
                column: z.number({
                    description: `The row to place the move in, 0-indexed. The range is 0 to ${this.game.boardSize - 1}`,
                }),
                row: z.number({
                    description: `The column to place the move in, 0-indexed. The range is 0 to ${this.game.boardSize - 1}`,
                }),
                reason: z.string({
                    description: `The reason for the move, if any.`,
                })
            }));

    }

    model = new OpenAI({
        temperature: 0,
        modelName: "gpt-3.5-turbo"
    });

    async parseOutputCorrectIfNecessary(response) {
        try {
            const {column, row, reason} = await this.parser.parse(response);
            console.log(`AI Reason: ${reason}`)
            return {column, row, reason};
        } catch (e) {
            console.log(pc.blue('Output was not valid, attempting to fix'))

            const fixParser =  OutputFixingParser.fromLLM(
                this.model,
                this.parser,
            );

            try {
                const {row, column} = await fixParser.parse(response);
                return {row, column}
            } catch (e) {
                console.log(pc.red('Unable to fix output, aborting chain and retrying'))
                return {
                    row: 0,
                    column: 0,
                    reason: 'AI Failed to make a move'
                }
            }

        }
    }

    async makeMoveWithFeedback(lastMove?) {

        if(lastMove) {
            console.log(pc.blue(`Retrying inference because ${lastMove.message}, last move was row:${lastMove.row},column:${lastMove.column}`))
        }

        const prompt = this.getPrompt(lastMove);

        console.log(pc.blue(`AI determining move for ${this.player}`));
        // console.log(pc.red(this.game.boardAsJson()))

        const input = await prompt.format({
            player: this.player,
            board: this.game.boardAsJson()
        });

        const response = await this.model.call(input);
        const {row, column} = await this.parseOutputCorrectIfNecessary(response)

        console.log(pc.blue(`AI attempting to play ${this.player} at ${row}, ${column}`));

        try {
            this.game.setMove(this.player, row, column);
        } catch (e) {
            // The move is invalid, repeat the process
            return this.makeMoveWithFeedback({
                column,
                row,
                message: e.message,
            });
        }
    }

    async makeMove() {
        return this.makeMoveWithFeedback();
    }

    private getPrompt(lastMove?) {

        const formatInstructions = this.parser.getFormatInstructions();

        if(lastMove) {
            return new PromptTemplate({
                template: `Play the TicTacToe game as best as possible.You are player {player}. You should always attempt to win, attempt to block the other player from winning, or make a setup move. You must make an available move, even if it means you lose the game. The game is won according to typical tic-tac-toe rules.\n{formatInstructions}\nThe board, E indicates Empty: {board}\nYour last move was invalid. It was row:{row},column:{column}.\n{message}`,
                inputVariables: ["player","board"],
                partialVariables: {
                    formatInstructions,
                    row: lastMove.row.toString(),
                    column: lastMove.column.toString(),
                    message: lastMove.message,
                },
            })
        }

        return new PromptTemplate({
            template: `Play the TicTacToe game as best as possible.You are player {player}\nYou should always attempt to win, attempt to block the other player from winning, or make a setup move.\nThe game is won according to typical tic-tac-toe rules. You must make an available move, even if it means you lose the game.\n{formatInstructions}\nThe board, E indicates Empty: {board}`,
            inputVariables: ["player","board"],
            partialVariables: {
                formatInstructions
            },
        });
    }
}
