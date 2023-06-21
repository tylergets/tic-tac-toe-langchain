export type TicTacToePlayer = 'X' | 'O' | null

type TicTacToeRow = TicTacToePlayer[];
type TicTacToeBoard = TicTacToeRow[];

export class TicTacToe {

    constructor(gameSize: number = 3) {
        this._gameSize = gameSize
        this._board = Array(gameSize).fill(null).map(() => Array(gameSize).fill(null))
    }

    // Decide who goes first
    protected _currentPlayer: TicTacToePlayer = 'X';

    protected _gameSize: number;
    protected _board: TicTacToeBoard;
    protected _moveHistory: {player, row, column}[] = [];

    get currentPlayer() {
        return this._currentPlayer;
    }

    get boardSize() {
        return this._gameSize;
    }

    get movesMade() {
        return this._moveHistory.length;
    }

    get isOver(): boolean {
        if (this.hasWinner) {
            return true;
        }

        // Is the board full?
        return this._board.every((row) => {
            return row.every((cell) => {
                return cell !== null;
            })
        });
    }

    get getWinner(): TicTacToePlayer {
        // Check rows
        for (let i = 0; i < this._gameSize; i++) {
            if (this._board[i].every((val) => val === 'X')) {
                return 'X';
            }
            if (this._board[i].every((val) => val === 'O')) {
                return 'O';
            }
        }

        // Check columns
        for (let i = 0; i < this._gameSize; i++) {
            let xCounter = 0;
            let oCounter = 0;
            for (let j = 0; j < this._gameSize; j++) {
                if (this._board[j][i] === 'X') {
                    xCounter++;
                } else if (this._board[j][i] === 'O') {
                    oCounter++;
                }
            }

            if (xCounter === this._gameSize) {
                return 'X';
            }
            if (oCounter === this._gameSize) {
                return 'O';
            }
        }

        // Check diagonals
        let diag1X = 0;
        let diag1O = 0;
        let diag2X = 0;
        let diag2O = 0;
        for (let i = 0; i < this._gameSize; i++) {
            if (this._board[i][i] === 'X') {
                diag1X++;
            } else if (this._board[i][i] === 'O') {
                diag1O++;
            }

            if (this._board[i][this._gameSize - i - 1] === 'X') {
                diag2X++;
            } else if (this._board[i][this._gameSize - i - 1] === 'O') {
                diag2O++;
            }
        }

        if (diag1X === this._gameSize) {
            return 'X';
        }
        if (diag1O === this._gameSize) {
            return 'O';
        }
        if (diag2X === this._gameSize) {
            return 'X';
        }
        if (diag2O === this._gameSize) {
            return 'O';
        }

        // No winner
        return null;
    }

    get hasWinner(): boolean {
        return this.getWinner !== null;
    }

    debug() {
        console.log({
            board: this._board,
            hasWinner: this.hasWinner,
            size: this._gameSize
        });
    }

    display(print = false) {

        const display = this._board.map((row) => {
            return row.map((cell) => {
                return cell || ' '
            }).join(' | ')
        }).join('\n')

        if(print) {
            console.log(`TicTacToe`)
            console.log(`==========`)
            console.log(display);
            console.log(`==========`)
        }

        return display;
    }

    setMove(player: TicTacToePlayer, row: number, column: number) {

        if (this.isOver) {
            throw new Error('Game is over')
        }

        if(this.currentPlayer !== player) {
            throw new Error('Not this players turn')
        }

        if (row > this._gameSize - 1) {
            throw new Error('Row is out of bounds');
        }

        if (column > this._gameSize - 1) {
            throw new Error('Column is out of bounds')
        }

        if(this._board[row][column] !== null) {
            throw new Error('Cell is already occupied')
        }

        this._board[row][column] = player;
        this._moveHistory.push({player, row, column})
        this._currentPlayer = this._currentPlayer === 'X' ? 'O' : 'X';
    }

    boardAsJson() {
        let output = "";

        for (let r = 0; r < this._gameSize; r++) {
            for (let c = 0; c < this._gameSize; c++) {
                const spot = (this._board[r][c] ?? 'E');
                output += `${r},${c},${spot}  `;
            }
            output += "\n";
        }

        return output;
    }
}
